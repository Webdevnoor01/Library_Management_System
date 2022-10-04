const { Schema, model, Types } = require("mongoose");

const teacherSchema = Schema(
  {
    teacherName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
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
      required: true,
    },
    userRole: {
      type: String,
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
