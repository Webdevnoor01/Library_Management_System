const { Schema, model } = require("mongoose");

const adminSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  avatar:{
    type:String,
    default:null
  },
  password: {
    type: String,
    required: true,
  },
  userRole:{
    type:String,
    required:true,
    default:"libAdmin"
  }
});

const LibraryAdmin = new model("LibraryAdmin", adminSchema);

module.exports = LibraryAdmin;
