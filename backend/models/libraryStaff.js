const { Schema, model } = require("mongoose");

const libraryStaffSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone:{
      type:Number,
      required:true
    },
    password: {
      type: String,
      required: true,
    },
    avatar:{
      type:String,
      default:null
    },
    userRole: {
      type: String,
      required: true,
      enum: ["Assistant", "Staff"],
    },
  },
  {
    timeStamps: true,
  }
);

const LibraryStaff = new model("LibraryStaff", libraryStaffSchema);
module.exports = LibraryStaff;
