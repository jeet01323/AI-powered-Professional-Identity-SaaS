const razorpay = require("../../config/razorpay");
const crypto = require("crypto");
const User = require("../../models/User");
const Order = require("../../models/Order");


// CREATE ORDER
const createOrder = async (
  req,
  res
) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        message: "Payment service is not configured",
      });
    }

    const options = {
      amount: 49900,

      currency: "INR",

      receipt:
        "receipt_" + Date.now(),
    };


    const order = await razorpay.orders.create(options);

    // Persist order and associate with user for ownership verification
    await Order.create({
      razorpayOrderId: order.id,
      userId: req.user.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: 'created',
    });

    res.json(order);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// VERIFY PAYMENT
const verifyPayment = async (
  req,
  res
) => {
  try {

    const {
      razorpay_order_id,

      razorpay_payment_id,

      razorpay_signature,
    } = req.body;


    // CREATE SIGNATURE
    const sign =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;


    // GENERATE EXPECTED SIGNATURE
    const expectedSign =
      crypto
        .createHmac(
          "sha256",

          process.env
            .RAZORPAY_KEY_SECRET
        )
        .update(sign.toString())
        .digest("hex");


    // VERIFY
    if (razorpay_signature === expectedSign) {
      // Ensure order belongs to this user
      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
      if (!order) {
        return res.status(400).json({ success: false, message: 'Order not found' });
      }

      if (order.userId.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Order does not belong to user' });
      }

      // Mark order as paid and save payment id
      order.status = 'paid';
      order.razorpayPaymentId = razorpay_payment_id;
      await order.save();

      // FIND USER
      const user = await User.findById(req.user.id);

      // ACTIVATE PREMIUM
      user.isPremium = true;
      user.premiumPlan = 'premium';
      await user.save();

      return res.json({
        success: true,
        message: 'Payment verified successfully',
        premium: user.isPremium,
      });
    }


    // INVALID SIGNATURE
    res.status(400).json({
      success: false,

      message:
        "Invalid payment signature",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  createOrder,

  verifyPayment,
};
