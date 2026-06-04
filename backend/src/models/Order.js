const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  razorpayOrderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  receipt: { type: String },
  status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  razorpayPaymentId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
