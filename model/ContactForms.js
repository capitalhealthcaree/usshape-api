const mongoose = require("mongoose");

const contactFormSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);
const ContactForm = mongoose.model("ContactForm", contactFormSchema);
module.exports = ContactForm;