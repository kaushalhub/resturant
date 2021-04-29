const express = require('express');
const router = express.Router();
const { getHotels, getHotel, addHotels
, updateHotel, deleteHotel, getHotelInRadius } = require('../controllers/hotels')


router.route('/radius/:zipcode/:distance').get(getHotelInRadius);
router.route('/').get(getHotels).post(addHotels);
router.route('/:id').get(getHotel).put(updateHotel).delete(deleteHotel)


module.exports = router;