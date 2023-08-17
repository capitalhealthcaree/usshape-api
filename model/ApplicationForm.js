const mongoose = require("mongoose");

const applicationFormSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    dob: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    temporaryAddress: { type: String, required: true },
    fatherName: { type: String, required: true },
    fatherOccupation: { type: String, required: true },
    fatherIncome: { type: String, required: true },
    passportNumber: { type: String, required: true },
    bankAccountNumber: { type: String, required: true },
    swiftCode: { type: String, required: true },
    appliedToOtherOrganization: { type: String, required: true },
    nationalityOtherThanPakistan: { type: String, required: true },
    travelledInternationally: { type: String, required: true },
    travelledInternationallyDetails: { type: String, required: true },
    whyWeConsidered: { type: String, required: true },

    collegeName: { type: String, required: true },
    graduationYear: { type: String, required: true },
    firstYearGrade: { type: String, required: true },
    secondYearGrade: { type: String, required: true },
    thirdYearGrade: { type: String, required: true },
    finalYearGrade: { type: String, required: true },
    otherQualifications: { type: String, required: true },
    awardsHonors: { type: String, required: true },

    step1Score: { type: String, required: true },
    step1Attempt: { type: String, required: true },
    step2CKScore: { type: String, required: true },
    step2CKAttempt: { type: String, required: true },
    step2CSScore: { type: String, required: true },
    step2CSAttempt: { type: String, required: true },
    step3Score: { type: String, required: true },
    step3Attempt: { type: String, required: true },

    signature: { type: String, required: true },
    termsConditions: { type: String, required: true },

    billImageUrls: { type: Array, required: true },
    certificateFileUrl: { type: String, required: true },
  },
  { timestamps: true }
);
const ApplicationForm = mongoose.model(
  "ApplicationForm",
  applicationFormSchema
);
module.exports = ApplicationForm;
