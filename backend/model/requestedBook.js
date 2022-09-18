const { Schema, model, Types } = require("mongoose");

const requestedBookSchema = Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
  },
  bookId: {
    type: Types.ObjectId,
    required: true,
  },
});

const RequestedBook = new model("RequestedBook", requestedBookSchema);

module.exports = RequestedBook;
