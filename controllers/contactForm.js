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
    // Send an email to the admin
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "webdevelopercapital@gmail.com",
        pass: "uvgqevylpebrtvgj",
      },
    });

    const mailOptions = {
      from: email,
      to: "webdevelopercapital@gmail.com",
      subject: "Client Query from USshape",
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
			<h1>Client's Details</h1>
			<p>Name : ${name}</p>
			<p>Email : ${email}</p>
			<p>Subject : ${subject}</p>
			<p>Contact Number : ${phone}</p>
			<p>Message : ${message}</p>
		  </body>
		</html>`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log(info);
      }
    });
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
