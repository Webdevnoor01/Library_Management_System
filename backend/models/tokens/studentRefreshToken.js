const { Schema, model, Types } = require("mongoose");

const studntRefreshTokenSchama = Schema(
  {
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: "Student",
    },
  },
  {
    timestapms: true,
  }
);

module.exports = new model("stRefresh", studntRefreshTokenSchama);
