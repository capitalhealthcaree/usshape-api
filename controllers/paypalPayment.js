const PaypalPayment = require("../model/PaypalPayment");

const PaypalPayments = async (req, res) => {
  const { order, data } = req.body;

  try {
    const paymentData = await PaypalPayment.create({
      order: order,
      data: data,
    });

    res.status(200).json({
      data: paymentData,
      message: "Payment successful",
    });
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: "Payment failed",
      success: false,
    });
  }
};

module.exports = { PaypalPayments };
