const { Schema, model, default: mongoose } = require("mongoose");

const studentSchema = Schema(
  {
    studentName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    teqachingRole: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    admission_date: {
      type: String,
      required: true,
    },
    current_year: {
      type: Number,
      required: true,
    },
    address: {
      village: {
        type: String,
        required: true,
      },
      ps: {
        type: String,
        required: true,
      },
      po: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
    },
    libraryId: {
      type: String,
      required: true,
    },
    issuedBookList: [
      {
        type: mongoose.Types.ObjectId,
        ref: "IssuedBooks",
      },
    ],
    requestedBookList: [
      {
        type: mongoose.Types.ObjectId,
        ref: "RequestedBooks",
      },
    ],
    fine: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Fine",
      },
    ],
  },
  {
    tiemstamps: true,
  }
);

const Students = new model("Students", studentSchema);
module.exports = Students;
