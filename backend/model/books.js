const { Schema, model } = require("mongoose");

const bookSchema = Schema(
  {
    bookName: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    bookEdition: [
      {
        type: String,
        required: true,
      },
    ],
    bookQuantity: {
      type: String,
      required: true,
    },
    bookImage: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      required: true,
    },
    almirahNo: {
      type: Number,
      required: true,
    },
    catogory: {
      type: String,
      required: true,
    },
  },
  {
    timeStamps: true,
  }
);

const Book = new model("Book", bookSchema);
module.exports = Book;
