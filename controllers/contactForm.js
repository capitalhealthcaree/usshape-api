const nodemailer = require("nodemailer");
const contactForm = require("../model/ContactForms");

const welocome = (req, res) => {
  res.send("Welcome usshape APIs");
};

// post request for contact form
const contactForms = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    const formData = await contactForm.create({
      name,
      email,
      phone,
      subject,
      message,
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

    const mailOptionAdmin = {
      from: email,
      to: "contact@usshape.org",
      subject: `${subject}`,
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
			<p>Name : ${name}</p>
			<p>Email : ${email}</p>
			<p>Contact Number : ${phone}</p>
			<p>Message : ${message}</p>
		  </body>
		</html>`,
    };
    const mailOptionsCandidate = {
      from: "contact@usshape.org",
      to: email,
      subject: "Query confirmation from USSHAPE",
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
                <p>Hello ${name}</p>
                <p>Your Query has been submitted successfully.</p>
                <p>Thank you for choosing USSHAPE!</p>
              </body>
            </html>`,
    };

    try {
      await transporter.sendMail(mailOptionAdmin);
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

    res
      .status(200)
      .json({ data: formData, mesasge: "Your query sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// get contact form by pagination
const getContactFormsByPagination = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // default to first page if page is not specified
  const limit = parseInt(req.query.limit) || 21; // default to 10 documents per page if limit is not specified
  const startIndex = (page - 1) * limit;

  try {
    const totalDocs = await contactForm.countDocuments();
    const data = await contactForm.find().skip(startIndex).limit(limit);

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalDocs / limit),
      data,
    });
  } catch (err) {
    res.status(500).json({ err: "getting some error" });
  }
};

module.exports = { welocome, getContactFormsByPagination, contactForms };
