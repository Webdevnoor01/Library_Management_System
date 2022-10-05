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
      type: Number,
      required: true,
    },
    bookImage: {
      type: String,
      required: false,
    },
    isbn: {
      type: String,
      required: true,
    },
    almirahNo: {
      type: Number,
      required: true,
    },
    category: {
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
