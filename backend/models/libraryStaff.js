const { Schema, model } = require("mongoose");

const bookSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Assistant", "Staff"],
    },
  },
  {
    timeStamps: true,
  }
);

const Book = new model("Book", bookSchema);
module.exports = Book;
