const { Schema, model, Types } = require("mongoose");

const teacherSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: Number,
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
    current_year: {
      type: Number,
    },
    userRole: {
      type: String,
      required: true,
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
      required: true,
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
    roles: {
      HOD: {
        depertment: {
          type: String,
          required:false,
          default:"No"
        },
        isHOD: {
          type: Boolean,
          required:false,
          default:false
        },
      },
      admissionCell: {
        type: Boolean,
        required:false,
        default:false
      },
      examCell: {
        type: Boolean,
        required:false,
        default:false
      },
    },
  },
  {
    tiemstamps: true,
  }
);

const Teacher = new model("Teacher", teacherSchema);
module.exports = Teacher;
