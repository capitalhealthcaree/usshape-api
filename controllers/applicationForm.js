const PDFDocument = require("pdfkit");
const fs = require("fs");
const nodemailer = require("nodemailer");
const ApplicationForm = require("../model/ApplicationForm");

// post request for contact form
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

  // Generate a unique code with sequential numbers
  function generateUniqueCode(fName, lName) {
    const formattedFirstName = fName.replace(/\s/g, "-").toLowerCase(); // Replace spaces with hyphens and convert to lowercase
    const formattedLastName = lName.replace(/\s/g, "-").toLowerCase(); // Replace spaces with hyphens and convert to lowercase

    // Generate a random number between 10000 and 99999 (5-digit range)
    const random5DigitNumber = Math.floor(Math.random() * 90000) + 10000;

    return `${formattedFirstName}-${formattedLastName}-${random5DigitNumber}`;
  }

  const shareUrl = generateUniqueCode(firstName, lastName);

  const mainUrl = "https://usshape.org/share-form/";
  const completeShareUrl = `${mainUrl}${shareUrl}`;

  try {
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

    // // Generate the PDF
    // const generatePdfBuffer = async (data) => {
    //   return new Promise((resolve, reject) => {
    //     const doc = new PDFDocument();
    //     const chunks = [];

    //     doc.on("data", (chunk) => chunks.push(chunk));
    //     doc.on("end", () => resolve(Buffer.concat(chunks)));
    //     doc.on("error", (err) => reject(err));

    //     doc.fontSize(18).text("Application Form", { align: "center" });
    //     doc.moveDown();
    //     doc.fontSize(12).text(`Name: ${data.firstName} ${data.lastName}`);
    //     doc.text(`Email: ${data.email}`);
    //     doc.text(`Phone: ${data.phoneNumber}`);
    //     // Add more fields as required...
    //     doc.end();
    //   });
    // };

    const generatePdfBuffer = async (data) => {
      return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 30 }); // Add margin for better layout
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
          .text("Shareable URL: ", { continued: true });
        doc.text(`${completeShareUrl}`, {
          link: `${completeShareUrl}`,
          underline: true,
          color: "blue",
        });
        // doc.fontSize(12).fillColor("black").text("Shareable URL", {
        //   link: completeShareUrl,
        //   underline: true,
        //   color: "blue",
        // });
        doc
          .fontSize(15)
          .fillColor("black")
          .text(`- Name: ${data.firstName} ${data.lastName}`);
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
          `- Have you applied for a loan from any other organization such as your medical college, alumni, or any physician working in the USA or Pakistan? ${data.appliedToOtherOrganization}`
        );
        doc.text(
          `- Nationality/Permanent Residency/Work Permit of any country other than Pakistan: ${data.nationalityOtherThanPakistan}`
        );
        doc.text(
          `- Have you travelled internationally for personal or professional reasons to attend conferences or to do electives?: ${data.travelledInternationally}`
        );
        if (data.travelledInternationally === "Yes") {
          doc.text(
            `- If "Yes", Please Provide details: ${data.travelledInternationallyDetails}`
          );
        }
        doc.text(`- Why you should be considered: ${data.whyWeConsidered}`);

        //Educational Information Section Header
        doc
          .fontSize(25)
          .fillColor("#003062")
          .text("Educational Information", { underline: true });
        doc.moveDown(0.5);
        // Content
        doc
          .fontSize(15)
          .fillColor("black")
          .text(`- Medical College Name: ${data.collegeName}`);
        doc.text(`- Graduation Yeare: ${data.graduationYear}`);
        doc.text(`- 1st Professional MBBS Grade: ${data.firstYearGrade}`);
        doc.text(`- 2nd Professional MBBS Grade: ${data.email}`);
        doc.text(`- 3rd Professional MBBS Grade: ${data.thirdYearGrade}`);
        doc.text(`- Final Professional MBBS Grade: ${data.finalYearGrade}`);
        doc.text(`- Other Qualifications: ${data.otherQualifications}`);
        doc.text(`- Awards & Honors: ${data.awardsHonors}`);

        doc.moveDown();

        //USMLE Scores Section Header
        doc
          .fontSize(25)
          .fillColor("#003062")
          .text("USMLE Scores", { underline: true });
        doc.moveDown(0.5);

        doc
          .fontSize(14)
          .fillColor("black")
          .text(`Step 1:`, { underline: true });
        doc.moveDown(0.5);
        doc.text(`Score: ${data.step1Score} || Attempt: ${data.step1Attempt}`);
        doc
          .fontSize(15)
          .fillColor("black")
          .text(`Step 2 CK:`, { underline: true });
        doc.moveDown(0.5);
        doc.text(
          `Score: ${data.step2CKScore} || Attempt: ${data.step2CKAttempt}`
        );
        doc
          .fontSize(15)
          .fillColor("black")
          .text(`Step 2 CS:`, { underline: true });
        doc.moveDown(0.5);
        doc.text(
          `Score: ${data.step2CSScore} || Attempt: ${data.step2CSAttempt}`
        );
        doc
          .fontSize(15)
          .fillColor("black")
          .text(`Step 3:`, { underline: true });
        doc.moveDown(0.5);
        doc.text(`Score: ${data.step3Score} || Attempt: ${data.step3Attempt}`);
        doc.text("Character Certificate", {
          link: data.certificateFileUrl,
          underline: true,
          color: "blue",
        });
        doc.text("Bill-1", {
          link: data.billImageUrls[0],
          underline: true,
          color: "blue",
        });
        doc.text("Bill-2", {
          link: data.billImageUrls[1],
          underline: true,
          color: "blue",
        });
        doc.text("Bill-3", {
          link: data.billImageUrls[2],
          underline: true,
          color: "blue",
        });
        doc.text(`Electronic Signature: ${data.signature}`);

        doc.moveDown();

        // Finalize the PDF
        doc.end();
      });
    };

    const pdfBuffer = await generatePdfBuffer({
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
    });

    // Send emails to both admin and candidate
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: "contact@usshape.org",
        pass: "C%nt@cT.org",
      },
    });

    const mailOptionsAdmin = {
      from: "contact@usshape.org",
      to: "contact@usshape.org",
      subject: "NBLTLMG Alert from USSHAPE",
      html: `
            <html>
              <head>
                <style>
                  h2 {
                    color: #003062;
                  }
                  p {
                    font-size: 18px;
                    line-height: 1.5;
                  }
                  .custom-container {
                    display: flex;
                    align-content: start;
                    flex-wrap: wrap;
                    padding: 1px;
                  }
                  
                  .step, .attempt {
                    margin-right: 10px; /* Adjust this value to control the spacing between elements */
                  }
                  
                  .divider {
                    margin: 0 5px; /* Adjust this value to control the spacing around the divider */
                  }
                </style>
              </head>
              <body>
                <h2><u>Personal Info:</u></h2>
                <a href=${completeShareUrl}>Shareable URL</a>
                <p><b>Name :</b> ${firstName} ${lastName}</p>
                <p><b>Email :</b> ${email}</p>
                <p><b>PhoneNumber :</b> ${phoneNumber}</p>
                <p><b>Date of Birth :</b> ${dob}</p>
                <p><b>Permanent Address :</b> ${permanentAddress}</p>
                <p><b>Temporary Address :</b> ${temporaryAddress}</p>
                <p><b>Father Name :</b> ${fatherName}</p>
                <p><b>Father Occupation :</b> ${fatherOccupation}</p>
                <p><b>Father's Income :</b> ${fatherIncome}</p>
                <p><b>Passport Number :</b> ${passportNumber}</p>
                <p><b>Bank Acc. Number :</b> ${bankAccountNumber}</p>
                <p><b>Swift Code :</b> ${swiftCode}</p>
                <p>Have you applied for a loan from any other organization such as your medical college, alumni, or any physician working in the USA or Pakistan? :<b>${appliedToOtherOrganization}</b></p>
                <p>Nationality/Permanent Residency/Work Permit of any country other than Pakistan :<b>${nationalityOtherThanPakistan}</b></p>
                <p>Have you travelled internationally for personal or professional reasons to attend conferences or to do electives? :<b>${travelledInternationally}</b></p>
                ${
                  travelledInternationally === "Yes"
                    ? `<p><b>If "Yes", Please Provide details :</b> ${travelledInternationallyDetails}</p>`
                    : ""
                }
                <p><b>Why you should be considered :</b><br/>${whyWeConsidered}</p>
                <h2><u>Educational Info:</u></h2>
                <p><b>Medical College Name :</b> ${collegeName}</p>
                <p><b>Graduation Yeare :</b> ${graduationYear}</p>
                <p><b>1st Professional MBBS Grade :</b> ${firstYearGrade}</p>
                <p><b>2nd Professional MBBS Grade :</b> ${secondYearGrade}</p>
                <p><b>3rd Professional MBBS Grade :</b> ${thirdYearGrade}</p>
                <p><b>Final Professional MBBS Grade :</b> ${finalYearGrade}</p>
                <p><b>Other Qualifications :</b><br/> ${otherQualifications}</p>
                <p><b>Awards & Honors :</b><br/> ${awardsHonors}</p>

                <h2><u>USMLE Scores:</u></h2>
                <div class="custom-container">
                  <div class="step"><b>Step 1 :</b> Score <b>: ${step1Score}</b></div>
                  <div class="divider">|</div>
                  <div class="attempt">Attempt <b>: ${step1Attempt}</b></div>
                </div>

                <div class="custom-container">
                  <div class="step"><b>Step 2 CK :</b> Score <b>: ${step2CKScore}</b></div>
                  <div class="divider">|</div>
                  <div class="attempt">Attempt <b>: ${step2CKAttempt}</b></div>
                </div>

                <div class="custom-container">
                  <div class="step"><b>Step 2 CS :</b> Score <b>: ${step2CSScore}</b></div>
                  <div class="divider">|</div>
                  <div class="attempt">Attempt <b>: ${step2CSAttempt}</b></div>
                </div>

                <div class="custom-container">
                <div class="step"><b>Step 3 :</b> Score <b>: ${step3Score}</b></div>
                <div class="divider">|</div>
                <div class="attempt">Attempt <b>: ${step3Attempt}</b></div></div>
                
              <a href=${certificateFileUrl}>Character Certificate</a><br/>
              <a href=${billImageUrls[0]}>Bill-1</a><br/>
              <a href=${billImageUrls[1]}>Bill-2</a><br/>
              <a href=${billImageUrls[2]}>Bill-3</a><br/>
              <p><b>Electronic Signature :</b> ${signature}</p>
              </body>
            </html>`,
      attachments: [
        {
          filename: `Application-${firstName}-${lastName}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

    const mailOptionsCandidate = {
      from: "contact@usshape.org",
      to: email,
      subject: "NBLTLMG Confirmation from USSHAPE",
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
                <p>Hello ${firstName} ${lastName}</p>
                <p>Your application has been submitted successfully.</p>
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
      mesasge: "Your application submitted successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// get contact form by pagination
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
