const ErrorResponse = require("../utilis/errorResponse");
const asyncHandler = require("../middleware/async");
const Product = require("../model/Product");
const Hotel = require("../model/Hotel");

// @dec            Get Product
// @route          GET /api/v1/products
// @access          Public
exports.getproducts = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.hotelId) {
    query = Hotel.find({ hotel: req.params.hotelId });
  } else {
    query = Hotel.find();
  }

  const products = await query;

  res
    .status(200)
    .json({ success: true, count: products.length, data: products });
});

// @dec            Get Single Product
// @route          GET /api/v1/products/:id
// @access         Prvate

exports.getproduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populated({
    path: "hotel",
    select: "name description",
  });

  if (!product) {
    return next(
      new ErrorResponse(`Product not fount with this id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: product });
});

// @dec            Add Product
// @route          POST /api/v1/hotel/:hotelId/products
// @access         Private

exports.addProduct = asyncHandler(async (req, res, next) => {
  req.body.hotel = req.params.hotelId;

  const hotel = await Hotel.findById(req.params.hotelId);

  if (!hotel) {
    return next(
      new ErrorResponse(
        `No Hotel found to add products on this ${req.params.hotelId} id`
      )
    );
  }

  const product = await Product.create(req.body);

  res.status(201).json({ success: true, data: product });
});
