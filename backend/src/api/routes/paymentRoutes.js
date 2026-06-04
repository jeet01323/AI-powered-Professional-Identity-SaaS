const express = require("express");

const router = express.Router();

const protect =
  require("../../middleware/authMiddleware");

const {
  createOrder,

  verifyPayment,

} = require(
  "../controllers/paymentController"
);

// CREATE ORDER
router.post(
  "/create-order",

  protect,

  createOrder
);

// VERIFY PAYMENT
router.post(
  "/verify",

  protect,

  verifyPayment
);


module.exports = router;