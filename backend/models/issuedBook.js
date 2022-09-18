const { Schema, model, Types } = require("mongoose");

const issuedBookSchema = Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
    },
    bookId: {
      type: Types.ObjectId,
      required: true,
    },
    whoIssued: {
      type: Types.ObjectId,
      required: true,
    },
    renewDate: {
      type: String,
      required: true,
    },
    isReturned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const IssuedBook = new model("IssuedBook", issuedBookSchema);
module.exports = IssuedBook;
