const mongoose = require("mongoose");

const rotationV2Schema = mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    reservation: { type: String },
    externshipPDFFormUrl: { type: String },
    termsConditions: { type: Boolean },
  },
  { timestamps: true }
);
const RotationV2 = mongoose.model("RotationV2", rotationV2Schema);
module.exports = RotationV2;
