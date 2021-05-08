const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title : {
        type : String,
        require : [true, 'Please add Title']
    },
    description : {
        type : String,
        require: [true, 'Please add Description']
    },
    price : {
        type : Number,
        require : [true, 'Please add Price']
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    hotel : {
        type : mongoose.Schema.ObjectId,
        ref : 'Hotel',
        require : true
    }
})

module.exports = mongoose.model('Product', ProductSchema);