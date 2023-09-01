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

    const mainUrl = "https://usshape.org/share-form/";
    const completeShareUrl = `${mainUrl}${shareUrl}`;

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

                <h2><u>USMLE Scores:<u></h2>
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

              </body>
            </html>`,
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
