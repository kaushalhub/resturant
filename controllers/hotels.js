// Import errorResponse
const ErrorResponse = require('../utilis/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utilis/geocoder');
const Hotel = require('../model/Hotel');

// desc    Get All Hotels
// GET     /api/v1/hotels
// Public
exports.getHotels = asyncHandler(async (req, res, next) => {
        let query;

        // copy req.query
        const reqQuery = { ...req.query }

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];

        // Loop over removeFields and delete time from reqQuery
        removeFields.forEach(params => delete reqQuery[params])

        // Create query string
        let queryStr = JSON.stringify(reqQuery)

        // Change the query into object string
        queryStr = queryStr.replace(/\b(gt|gte}lt|lte|in)\b/g, match =>  `$${match}`);

        // Find resourse
        query = Hotel.find(JSON.parse(queryStr))

        // select fields
        if(req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // sort
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt')
        }


        //pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 1;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit
        const total = await Hotel.countDocuments();

        query = query.skip(startIndex).limit(limit);

        const hotel = await query;

        // Pgaination result
        const pagination = {};

        if(endIndex < total) {
            pagination.next = {
                page : page + 1,
                limit
            }
        }

        if(startIndex > 0) {
            pagination.prev = {
                page : page - 1,
                limit
            }
        }

        res.status(200).json({ success : true, count : hotel.length, pagination, data : hotel })

});

// desc    Add Hotels
// POST     /api/v1/hotels
// Private
exports.addHotels = async (req,res,next)=>{
    try {
        const hotel = await Hotel.create(req.body);

        res.status(201).json({ success : true, data : hotel })
    } catch (err) {
        next(err)
        
    }
}

// desc    Get Hotel By ID
// GET     /api/v1/hotels
// Private
exports.getHotel = async (req,res,next) => {
    try {
        const hotel = await Hotel.findById(req.params.id) 

        res.status(200).json({ success : true, data : hotel })
    } catch (err) {
        // res.status(400).json({ success : false })
        next(err)
    }
}   

// desc    Update Hotel
// PUT     /api/v1/hotels/:id
// Private
exports.updateHotel = async (req,res,next) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
            new : true,
            runValidators :  true    
        })
            res.status(200).json({ success : true, data : hotel })
    } catch(err) {
        next(err)
    }
}

// desc    Delete Hotel
// DELETE     /api/v1/hotels
// Private
exports.deleteHotel = async (req,res,next) => {
    try {
        const hotel = await Hotel.findByIdAndRemove(req.params.id)

        res.status(200).json({ success : true, data : hotel })
    } catch (err) {
        next(err)
    }
}

// desc    Near By Hotel
// DELETE     /api/v1/hotels/radius/:zipcode/:distance
// Private

exports.getHotelInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params  

    // get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude

    // calc radius using radians
    // Divide dist by radius of earth
    // Earth Radius = 6,378km

    const radius = distance / 6378;

    const hotels = await Hotel.find({ 
        location : { $geoWithin : { $centerSphere : [[ lng, lat ], radius] } }
     })

     res.status(200).json({ success : true, data : hotels })
})