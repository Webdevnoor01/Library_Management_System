const { Schema, model, Types } = require("mongoose");

const studentSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
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
    },
    semester: {
      type: String,
    },
    admission_date: {
      type: String,
    },
    current_year: {
      type: Number,
    },
    userRole: {
      type: String,
    },
    address: {
      village: {
        type: String,
      },
      ps: {
        type: String,
      },
      po: {
        type: String,
      },
      district: {
        type: String,
      },
      state: {
        type: String,
      },
    },
    libraryId: {
      type: String,
    },
    issuedBookList: [
      {
        type: Types.ObjectId,
        ref: "Book",
      },
    ],
    requestedBookList: [
      {
        type: Types.ObjectId,
        ref: "RequestedBook",
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
