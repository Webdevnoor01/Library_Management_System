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
      ref:"Book"
    },
    whoIssued: {
      type: String,
      required: true,
    },
    renewDate: {
      type: Date,
      required: true,
      default:Date.now()
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
