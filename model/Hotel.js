const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require('../utilis/geocoder');

const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please Add Name"],
    unique: true,
    maxlength: [50, "Please add Max length of name"],
  },
  description: {
    type: String,
    require: [true, "Please add description"],
  },
  slug: String,
  gstNumber: String,

  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      required: false,
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },

  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use a valid URL with HTTP or HTTPS",
    ],
  },

  phone: {
    type: String,
    maxlength: [20, "Phone number can not be longer than 20 characters"],
  },

  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  address: {
    type: String,
    require: [true, "Please add address"],
  },
  hotel_type: {
    type: String,
    require: [true, "Please add Hotel_type"],
  },
  averageCost: Number,
  averageRating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [10, "Rating must can not be more than 10"],
  },

  createdAt : {
    type : Date,
    default : Date.now()
  }
}, {
  toJSON : { virtuals : true },
  toObject : { virtuals : true }
});

// Create Hotel slug from the name
HotelSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower : true });
  next();
})

// Geocode & create localtion field
HotelSchema.pre('save', async function(next) {
  const loc = await geocoder.geocode(this.address);

  this.location = {
    type : 'Point',
    coordinates : [loc[0].longitude, loc[0].latitude],
    formattedAddress : loc[0].formattedAddress,
    street : loc[0].streetName,
    city : loc[0].city,
    state : loc[0].stateCode,
    zipcode : loc[0].zipcode,
    country : loc[0].countryCode
  }

  // do not save address field
  this.address = undefined
  next();
})


// Cascade delete product when a hotel is deleted
HotelSchema.pre('remove', async function (next) {
  await this.model('product').deleteMany({ hotel : this._id })
  next();
})

// Resverse populate with virtuals
HotelSchema.virtual('product', {
  ref : 'Product',
  localField : '_id',
  foreignField : 'hotel',
  justOne : false
})

module.exports = mongoose.model("Hotel", HotelSchema);