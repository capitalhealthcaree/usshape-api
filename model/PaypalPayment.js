const mongoose = require("mongoose");

const paypalPaymentSchema = mongoose.Schema(
  {
    order: { type: Array },
    data: { type: Array },
  },
  { timestamps: true }
);
const PaypalPayment = mongoose.model("PaypalPayment", paypalPaymentSchema);
module.exports = PaypalPayment;
