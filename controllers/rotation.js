const nodemailer = require("nodemailer");
const Rotation = require("../model/rotation");
const PaypalPayment = require("../model/PaypalPayment");

// post request for contact form
const RotationForms = async (req, res) => {
  const { name, email, termsConditions, reservation, merchantTransactionId } =
    req.body;

  try {
    // Check if the email is already in the database
    const existingRotation = await Rotation.findOne({ email });
    if (existingRotation) {
      // Email already reserved
      return res.status(400).json({
        message: "This email is already reserved for a rotation",
      });
    }

    // Check Payment is receieved or not
    const isPaymentReceieved = await PaypalPayment.findOne({
      "order.0.purchase_units.0.payments.captures.0.id": merchantTransactionId,
    });
    if (!isPaymentReceieved) {
      return res.status(400).json({
        message: "No payment has been made",
      });
    }

    // Generate a unique code with sequential numbers
    function generateUniqueCode(name) {
      // Replace spaces with hyphens and convert to lowercase
      const formattedName = name.replace(/\s/g, "-").toLowerCase();

      // Generate a random number between 10000 and 99999 (5-digit range)
      const random5DigitNumber = Math.floor(Math.random() * 90000) + 10000;

      return `${formattedName}-${random5DigitNumber}`;
    }

    const shareUrl = generateUniqueCode(name);

    // Email not reserved, create the rotation
    const formData = await Rotation.create({
      name,
      email,
      termsConditions,
      reservation,
      merchantTransactionId,
      url: shareUrl,
    });

    // Send emails to both admin and candidate
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: "contact@usshape.org",
        pass: "786@USshape~",
      },
    });

    const mainUrl = "https://usshape.org/share-externship-form/";
    const completeShareUrl = `${mainUrl}${shareUrl}`;

    const mailOptionsAdmin = {
      from: "contact@usshape.org",
      to: "contact@usshape.org",
      subject: "Externship Alert from USSHAPE",
      html: `
            <html>
              <head>
                <style>
                  h1 {
                    color: #003062;
                  }
                  p {
                    font-size: 18px;
                    line-height: 1.5;
                  }
                </style>
              </head>
              <body>
                <h1>Details</h1>
                <a href=${completeShareUrl}>Shareable URL</a>
                <p>Name: ${name}</p>
                <p>Email: ${email}</p>
                <p>Reserved Rotation: ${reservation}</p>
                <p>Merchant Transaction ID: ${merchantTransactionId}</p>
              </body>
            </html>`,
    };

    const mailOptionsCandidate = {
      from: "contact@usshape.org",
      to: email,
      subject: "Reservation Confirmation from USSHAPE",
      html: `
            <html>
              <head>
                <style>
                  h1 {
                    color: #003062;
                  }
                  p {
                    font-size: 18px;
                    line-height: 1.5;
                  }
                </style>
              </head>
              <body>
                <h1>Reservation Confirmation</h1>
                <p>Hello ${name},</p>
                <p>Your rotation reservation has been successfully confirmed.</p>
                <p>Reservation: ${reservation}</p>
                <p>Thank you for choosing USSHAPE!</p>
              </body>
            </html>`,
    };

    try {
      await transporter.sendMail(mailOptionsAdmin);
      console.log("Admin confirmation email sent successfully");
    } catch (err) {
      console.error("Error sending admin confirmation email:", err);
      return res.status(500).json({
        message: "Error sending admin confirmation email",
      });
    }

    try {
      await transporter.sendMail(mailOptionsCandidate);
      console.log("User confirmation email sent successfully");
    } catch (err) {
      console.error("Error sending admin confirmation email:", err);
      return res.status(500).json({
        message: "Error sending admin confirmation email",
      });
    }

    res.status(200).json({
      data: formData,
      message: "Your rotation is reserved successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get contact form by pagination
const GetRotationBySlug = async (req, res) => {
  try {
    const slug = req.query.url;
    const form = await Rotation.findOne({ url: slug });
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.status(200).json({ data: form });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = { RotationForms, GetRotationBySlug };
