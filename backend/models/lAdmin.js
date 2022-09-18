const { Schema, model } = require("mongoose");

const adminSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  email: {
    type: Stirng,
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
});

const LibraryAdmin = new model("LibraryAdmin", adminSchema);

module.exports = LibraryAdmin;
