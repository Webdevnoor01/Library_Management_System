const { Schema, model, Types } = require("mongoose");

const libraryCardSchema = Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    depertment: {
      type: String,
      required: true,
    },
    issueDate: {
      type: String,
      require: true,
    },
    libraryId: {
      type: String,
      require: true,
    },
    bookLimit: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const LibraryCard = new model("LibraryCard", libraryCardSchema);

module.exports = LibraryCard;
