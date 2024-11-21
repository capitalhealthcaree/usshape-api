require('dotenv').config();
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const ApplicationForm = require("../model/ApplicationForm");

/// post request for contact form
// Helper function to generate a unique shareable URL
function generateUniqueCode(fName, lName) {
  const formattedFirstName = fName.replace(/\s/g, "-").toLowerCase();
  const formattedLastName = lName.replace(/\s/g, "-").toLowerCase();
  const random5DigitNumber = Math.floor(Math.random() * 90000) + 10000;
  return `${formattedFirstName}-${formattedLastName}-${random5DigitNumber}`;
}

// Helper function to create PDF buffer
const generatePdfBuffer = async (data, completeShareUrl) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 30 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (err) => reject(err));

    // Title
    doc
      .fontSize(35)
      .text("Nagy Loan Program for Young Physicians", { align: "center" });
    doc.moveDown();

    // Personal Information Section Header
    doc
      .fontSize(25)
      .fillColor("#003062")
      .text("Personal Information", { underline: true });
    doc.moveDown(0.5);

    // Content
    doc
      .fontSize(15)
      .fillColor("black")
      .text("- Shareable URL: ", { continued: true });
    doc.text(`${completeShareUrl}`, {
      link: `${completeShareUrl}`,
      underline: true,
      color: "blue",
    });
    doc.text(`- Name: ${data.firstName} ${data.lastName}`);
    doc.text(`- Email: ${data.email}`);
    doc.text(`- Phone: ${data.phoneNumber}`);
    doc.text(`- Date of Birth: ${data.dob}`);
    doc.text(`- Permanent Address: ${data.permanentAddress}`);
    doc.text(`- Temporary Address: ${data.temporaryAddress}`);
    doc.text(`- Father Name: ${data.fatherName}`);
    doc.text(`- Father Occupation: ${data.fatherOccupation}`);
    doc.text(`- Father's Income: ${data.fatherIncome}`);
    doc.text(`- Passport Number: ${data.passportNumber}`);
    doc.text(`- Bank Acc. Number: ${data.bankAccountNumber}`);
    doc.text(`- Swift Code: ${data.swiftCode}`);
    doc.text(
      `- Have you applied for a loan from any other organization? ${data.appliedToOtherOrganization}`
    );
    doc.text(
      `- Nationality/Permanent Residency/Work Permit of any country other than Pakistan: ${data.nationalityOtherThanPakistan}`
    );
    doc.text(
      `- Have you travelled internationally for personal or professional reasons? ${data.travelledInternationally}`
    );
    if (data.travelledInternationally === "Yes") {
      doc.text(
        `- If "Yes", Please Provide details: ${data.travelledInternationallyDetails}`
      );
    }
    doc.text(`- Why you should be considered: ${data.whyWeConsidered}`);
    doc.moveDown(0.5);

    // Educational Information Section Header
    doc
      .fontSize(25)
      .fillColor("#003062")
      .text("Educational Information", { underline: true });
    doc.moveDown(0.5);
    doc
      .fontSize(15)
      .fillColor("black")
      .text(`- Medical College Name: ${data.collegeName}`);
    doc.text(`- Graduation Year: ${data.graduationYear}`);
    doc.text(`- 1st Professional MBBS Grade: ${data.firstYearGrade}`);
    doc.text(`- 2nd Professional MBBS Grade: ${data.secondYearGrade}`);
    doc.text(`- 3rd Professional MBBS Grade: ${data.thirdYearGrade}`);
    doc.text(`- Final Professional MBBS Grade: ${data.finalYearGrade}`);
    doc.text(`- Other Qualifications: ${data.otherQualifications}`);
    doc.text(`- Awards & Honors: ${data.awardsHonors}`);

    doc.moveDown();

    // USMLE Scores Section Header
    doc
      .fontSize(25)
      .fillColor("#003062")
      .text("USMLE Scores", { underline: true });
    doc.moveDown(0.5);

    // Score Details
    doc.text(`Step 1: Score: ${data.step1Score} || Attempt: ${data.step1Attempt}`);
    doc.text(`Step 2 CK: Score: ${data.step2CKScore} || Attempt: ${data.step2CKAttempt}`);
    doc.text(`Step 2 CS: Score: ${data.step2CSScore} || Attempt: ${data.step2CSAttempt}`);
    doc.text(`Step 3: Score: ${data.step3Score} || Attempt: ${data.step3Attempt}`);

    // Links
    doc.moveDown(0.5);
    doc.text("Character Certificate", {
      link: data.certificateFileUrl,
      underline: true,
      color: "blue",
    });
    doc.moveDown(0.5);
    data.billImageUrls.forEach((url, index) => {
      doc.text(`Bill-${index + 1}`, {
        link: url,
        underline: true,
        color: "blue",
      });
    });
    doc.moveDown(0.5);
    doc.text(`Electronic Signature: ${data.signature}`);

    // Finalize the PDF
    doc.end();
  });
};

// Helper function to send email
const sendEmail = async (transporter, mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

const applicationForms = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    dob,
    permanentAddress,
    temporaryAddress,
    fatherName,
    fatherOccupation,
    fatherIncome,
    passportNumber,
    bankAccountNumber,
    swiftCode,
    appliedToOtherOrganization,
    nationalityOtherThanPakistan,
    travelledInternationally,
    travelledInternationallyDetails,
    whyWeConsidered,
    collegeName,
    graduationYear,
    firstYearGrade,
    secondYearGrade,
    thirdYearGrade,
    finalYearGrade,
    otherQualifications,
    awardsHonors,
    step1Score,
    step1Attempt,
    step2CKScore,
    step2CKAttempt,
    step2CSScore,
    step2CSAttempt,
    step3Score,
    step3Attempt,
    signature,
    termsConditions,
    billImageUrls,
    certificateFileUrl,
  } = req.body;

  // Generate a shareable URL
  const shareUrl = generateUniqueCode(firstName, lastName);
  const mainUrl = "https://usshape.org/share-form/";
  const completeShareUrl = `${mainUrl}${shareUrl}`;

  try {
    // Store the form data in the database
    const formData = await ApplicationForm.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      dob,
      permanentAddress,
      temporaryAddress,
      fatherName,
      fatherOccupation,
      fatherIncome,
      passportNumber,
      bankAccountNumber,
      swiftCode,
      appliedToOtherOrganization,
      nationalityOtherThanPakistan,
      travelledInternationally,
      travelledInternationallyDetails,
      whyWeConsidered,
      collegeName,
      graduationYear,
      firstYearGrade,
      secondYearGrade,
      thirdYearGrade,
      finalYearGrade,
      otherQualifications,
      awardsHonors,
      step1Score,
      step1Attempt,
      step2CKScore,
      step2CKAttempt,
      step2CSScore,
      step2CSAttempt,
      step3Score,
      step3Attempt,
      signature,
      termsConditions,
      billImageUrls,
      certificateFileUrl,
      url: shareUrl,
    });

    // Generate PDF
    const pdfBuffer = await generatePdfBuffer(
      {
        firstName,
        lastName,
        email,
        phoneNumber,
        dob,
        permanentAddress,
        temporaryAddress,
        fatherName,
        fatherOccupation,
        fatherIncome,
        passportNumber,
        bankAccountNumber,
        swiftCode,
        appliedToOtherOrganization,
        nationalityOtherThanPakistan,
        travelledInternationally,
        travelledInternationallyDetails,
        whyWeConsidered,
        collegeName,
        graduationYear,
        firstYearGrade,
        secondYearGrade,
        thirdYearGrade,
        finalYearGrade,
        otherQualifications,
        awardsHonors,
        step1Score,
        step1Attempt,
        step2CKScore,
        step2CKAttempt,
        step2CSScore,
        step2CSAttempt,
        step3Score,
        step3Attempt,
        signature,
        termsConditions,
        billImageUrls,
        certificateFileUrl,
      },
      completeShareUrl
    );

    // Email configuration
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.ADMIN_EMAIL, // Your email user
        pass: process.env.EMAIL_PASSWORD, // Your email password
      },
    });

    // Email options for admin and candidate
    const mailOptionsAdmin = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "New Application Received",
      text: `A new application has been received from ${firstName} ${lastName}.`,
      attachments: [
        {
          filename: `${firstName}_${lastName}_Application.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    const mailOptionsCandidate = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: "Application Submission Confirmation",
      text: `Dear ${firstName} ${lastName}, your application has been successfully submitted.`,
    };

    // Send emails in parallel
    const [adminEmailStatus, candidateEmailStatus] = await Promise.all([
      sendEmail(transporter, mailOptionsAdmin),
      sendEmail(transporter, mailOptionsCandidate),
    ]);

    if (!adminEmailStatus || !candidateEmailStatus) {
      throw new Error("Failed to send confirmation emails");
    }

    // Respond with success message
    res.status(200).json({
      data: formData,
      message: "Your application submitted successfully.",
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
};

//******************************************** get contact form by pagination **************************************
const getApplicationFormsByPagination = async (req, res) => {
  try {
    const data = await ApplicationForm.find().sort({ createdAt: -1 });

    res.status(200).json({
      data: data,
    });
  } catch (err) {
    res.status(500).json({ err: "Encountered an error" });
  }
};

// get Application Form By Url
const getApplicationFormByUrl = async (req, res) => {
  try {
    const slug = req.query.url;
    const form = await ApplicationForm.findOne({ url: slug });
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.status(200).json({ data: form });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  applicationForms,
  getApplicationFormsByPagination,
  getApplicationFormByUrl,
};
