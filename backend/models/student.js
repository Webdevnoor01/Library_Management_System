const { Schema, model, Types } = require("mongoose");

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
    depertment: {
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
        type: Types.ObjectId,
        ref: "IssuedBooks",
      },
    ],
    requestedBookList: [
      {
        type: Types.ObjectId,
        ref: "RequestedBooks",
      },
    ],
    fine: [
      {
        type: Types.ObjectId,
        ref: "Fine",
      },
    ],
  },
  {
    tiemstamps: true,
  }
);

const Student = new model("Student", studentSchema);
module.exports = Student;
