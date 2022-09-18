const { Schema, model, Types } = require("mongoose");

const fineSchema = Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
    },
    user: {
      student: {
        type: Types.ObjectId,
        ref: "Student",
      },
      teachaer: {
        type: Types.ObjectId,
        ref: "Teacher",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Fine = new model("Fine", fineSchema);
module.exports = Fine;
