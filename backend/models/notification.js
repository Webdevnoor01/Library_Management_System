const { Schema, model, Types } = require("mongoose");

const notificaitonSchema = Schema(
  {
    message: {
      type: String,
      required: true,
    },
    sender: {
      libraryAdmin: {
        type: Types.ObjectId,
        ref: "LibraryAdmin",
      },
      libraryAssistant: {
        type: Types.ObjectId,
        ref: "LibraryStaff",
      },
    },
    receiver: {
      student: {
        type: Types.ObjectId,
        ref: "Student",
      },
      teacher: {
        type: Types.ObjectId,
        ref: "Teacher",
      },
    },
  },
  { timestamps: true }
);
