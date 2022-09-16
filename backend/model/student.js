const { Schema, model } = require("mongoose");

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
      required: true,
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
    },
  },
  {
    tiemstamps: true,
  }
);
