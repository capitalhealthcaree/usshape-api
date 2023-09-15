const mongoose = require("mongoose");

const externshipPaypalSchema = mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    termsConditions: { type: Boolean },
    reservation: { type: String },
    url: { type: String },
  },
  { timestamps: true }
);
const ExternshipPaypal = mongoose.model("ExternshipPaypal", externshipPaypalSchema);
module.exports = ExternshipPaypal;
