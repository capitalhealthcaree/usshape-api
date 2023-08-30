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

  let counter = 1;
  // Generate a unique code with sequential numbers
  function generateUniqueCode(fName, lName) {
    const formattedFirstName = fName.replace(/\s/g, "").toLowerCase(); // Remove spaces and convert to lowercase
    const formattedLastName = lName.replace(/\s/g, "").toLowerCase(); // Remove spaces and convert to lowercase
    const formattedCounter = counter.toString().padStart(5, "0"); // Ensure 5 digits
    counter++; // Increment the counter for the next person
    return `${formattedFirstName}-${formattedLastName}-${formattedCounter}`;
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

    const mailOptionsAdmin = {
      from: "contact@usshape.org",
      to: "contact@usshape.org",
      subject: "NBLTLMG Alert from USSHAPE",
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
                <h1>Personal Info:</h1>
                <a href=${`https://usshape.org/forward-form/${shareUrl}`}}>Shareable URL</a>
                <p>Name: ${firstName} ${lastName}</p>
                <p>Email: ${email}</p>
                <p>PhoneNumber: ${phoneNumber}</p>
                <p>Date of Birth: ${dob}</p>
                <p>Permanent Address: ${permanentAddress}</p>
                <p>Temporary Address: ${temporaryAddress}</p>
                <p>Father Name: ${fatherName}</p>
                <p>Father Occupation: ${fatherOccupation}</p>
                <p>Father's Income: ${fatherIncome}</p>
                <p>Passport Number: ${passportNumber}</p>
                <p>Bank Account Number: ${bankAccountNumber}</p>
                <p>Swift Code: ${swiftCode}</p>
                <p>Have you applied for a loan from any other organization such as your medical college, alumni, or any physician working in the USA or Pakistan?: ${appliedToOtherOrganization}</p>
                <p>Nationality/Permanent Residency/Work Permit of any country other than Pakistan: ${nationalityOtherThanPakistan}</p>
                <p>Have you travelled internationally for personal or professional reasons to attend conferences or to do electives? : ${travelledInternationally}</p>
                ${
                  travelledInternationally === "Yes"
                    ? `<p>If "Yes", Please Provide details <b>: ${travelledInternationallyDetails}</b></p>`
                    : ""
                }
                <p>Why you should be considered: ${whyWeConsidered}</p>
                <h1>Educational Info:</h1>
                <p>Medical College Name: ${collegeName}</p>
                <p>Graduation Yeare: ${graduationYear}</p>
                <p>1st Professional MBBS Grade: ${firstYearGrade}</p>
                <p>2nd Professional MBBS Grade: ${secondYearGrade}</p>
                <p>3rd Professional MBBS Grade: ${thirdYearGrade}</p>
                <p>Final Professional MBBS Grade: ${finalYearGrade}</p>
                <p>Other Qualifications: ${otherQualifications}</p>
                <p>Awards & Honors: ${awardsHonors}</p>
                <h1>USMLE Scores:</h1>
                <h5>Step 1</h5>
                <p>Score: ${step1Score}</p>   <p>Attempt: ${step1Attempt}</p>
                <h5>Step 2 - CK</h5>
                <p>Score: ${step2CKScore}</p>   <p>Attempt: ${step2CKAttempt}</p>
                <h5>Step 2 - CS</h5>
                <p>Score: ${step2CSScore}</p>   <p>Attempt: ${step2CSAttempt}</p>
                <h5>Step 3</h5>
                <p>Score: ${step3Score}</p>   <p>Attempt: ${step3Attempt}</p>
                <p><a href=${certificateFileUrl}>Character Certificate</a></p>
                <p>Last Three Electric Bill:<br/>
                 <a href=${billImageUrls[0]}>Bill-1</a><br/>
                 <a href=${billImageUrls[1]}>Bill-2</a><br/>
                 <a href=${billImageUrls[2]}>Bill-3</a><br/>
                 </p>
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

    transporter.sendMail(mailOptionsAdmin, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log(info);
      }
    });

    transporter.sendMail(mailOptionsCandidate, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log(info);
      }
    });
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
  const page = parseInt(req.query.page) || 1; // default to first page if page is not specified
  const limit = parseInt(req.query.limit) || 21; // default to 10 documents per page if limit is not specified
  const startIndex = (page - 1) * limit;

  try {
    const totalDocs = await ApplicationForm.countDocuments();
    const data = await ApplicationForm.find().skip(startIndex).limit(limit);

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalDocs / limit),
      data,
    });
  } catch (err) {
    res.status(500).json({ err: "getting some error" });
  }
};

module.exports = { applicationForms, getApplicationFormsByPagination };
