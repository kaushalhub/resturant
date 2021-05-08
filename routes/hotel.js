const express = require('express');
const router = express.Router();
const { getHotels, getHotel, addHotels
, updateHotel, deleteHotel, getHotelInRadius } = require('../controllers/hotels')


// Include other resouce routes
const productRouter = require('./product');

// Re-route  into other resource routers
router.use('/:hotelId/products', productRouter)

router.route('/radius/:zipcode/:distance').get(getHotelInRadius);
router.route('/').get(getHotels).post(addHotels);
router.route('/:id').get(getHotel).put(updateHotel).delete(deleteHotel)


module.exports = router;