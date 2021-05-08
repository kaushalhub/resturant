const express = require("express");
const router = express.Router({ mergeParams : true });

const {
  getproducts,
  getproduct,
  addProduct,
} = require("../controllers/products");

router.route("/").get(getproducts).post(addProduct);
router.route("/:id").get(getproduct);

module.exports = router;
