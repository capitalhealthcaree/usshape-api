const nodemailer = require("nodemailer");
const RotationV2 = require("../model/rotationV2");
const PDFDocument = require("pdfkit");

const generatePDF = (details) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      let pdfBuffer = Buffer.alloc(0);

      doc.on("data", (chunk) => {
        pdfBuffer = Buffer.concat([pdfBuffer, chunk]);
      });

      doc.on("end", () => resolve(pdfBuffer));

      doc.fontSize(16).text("Rotation Details", { align: "center" });
      doc.moveDown();
      doc.text(`Name: ${details.name}`);
      doc.text(`Email: ${details.email}`);
      doc.text(`Reserved Rotation: ${details.reservation}`);
      doc.text(`Externship Form URL: ${details.externshipPDFForm}`);
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

const sendEmails = async (details) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: "contact@usshape.org",
      pass: "C%nt@cT.org",
    },
  });

  // Admin email
  const adminMailOptions = {
    from: "contact@usshape.org",
    to: "contact@usshape.org",
    subject: "Externship Alert from USSHAPE",
    html: `
      <h2>Rotation Reservation Details</h2>
      <p><strong>Name:</strong> ${details.name}</p>
      <p><strong>Email:</strong> ${details.email}</p>
      <p><strong>Reserved Rotation:</strong> ${details.reservation}</p>
      <p><strong>Externship Form URL:</strong> ${details.externshipPDFForm}</p>
    `,
    attachments: [
      {
        filename: `${details.email}-rotation-details.pdf`,
        content: details.pdfFilePath, // PDF Buffer
      },
    ],
  };

  // Candidate email
  const candidateMailOptions = {
    from: "contact@usshape.org",
    to: details.email,
    subject: "Reservation Confirmation from USSHAPE",
    html: `
      <h2>Reservation Confirmation</h2>
      <p>Hello ${details.name},</p>
      <p>Your rotation reservation has been successfully confirmed.</p>
      <p>Reservation: ${details.reservation}</p>
      <p>Thank you for choosing USSHAPE!</p>
    `,
  };

  // Send emails
  await transporter.sendMail(adminMailOptions);
  await transporter.sendMail(candidateMailOptions);
};

const CreateRotationForm = async (req, res) => {
  const { name, email, termsConditions, reservation, externshipPDFForm } = req.body;

  try {
    // Check if the email is already in the database
    const existingRotation = await RotationV2.findOne({ email });
    if (existingRotation) {
      return res.status(400).json({
        message: "This email is already reserved for a rotation",
      });
    }

    // Create the rotation
    const formData = await RotationV2.create({
      name,
      email,
      termsConditions,
      reservation,
      externshipPDFFormUrl: externshipPDFForm,
    });

    // Generate PDF
    const pdfFilePath = await generatePDF({
      name,
      email,
      reservation,
      externshipPDFForm,
    });

    // Send Emails (including the generated PDF as an attachment)
    await sendEmails({
      name,
      email,
      reservation,
      pdfFilePath,
    });

    // Send the response
    res.status(200).json({
      data: formData,
      message: "Your rotation is reserved successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get reserved  rotations
const GetReservedRotation = async (req, res) => {
  try {
    const data = await RotationV2.find();

    if (data) {
      // Extract reservation Date from the data and ignore other fields
      const reservationList = data.map((item) => item.reservation);
      res.status(200).json({ reservationList });
    } else {
      res.status(500).json({ err: "Encountered an error while fetching data" });
    }
  } catch (error) {
    res.status(500).json({ err: "An error occurred", error });
  }
};

const getAllRotationV2 = async (req, res) => {
  let data = await RotationV2.find();
  if (data) {
    res.status(200).json({ data });
  } else {
    res.status(500).json({ err: "getting some error" });
  }
};

module.exports = { CreateRotationForm, GetReservedRotation,getAllRotationV2 };
