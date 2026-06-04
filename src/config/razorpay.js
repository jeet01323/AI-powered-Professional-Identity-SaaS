let Razorpay = null;
try {
  Razorpay = require('razorpay');
} catch (err) {
  // optional dependency — continue without Razorpay if it's not installed
  Razorpay = null;
}

const hasRazorpayCredentials =
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET;

const razorpay = Razorpay && hasRazorpayCredentials
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

module.exports = razorpay;
