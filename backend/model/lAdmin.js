const { Schema, model } = require("mongoose");

/*
Name
User id
Email
avatar
Phone
Password
*/
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

const Admin = new model("Admin", adminSchema);

module.exports = Admin;
