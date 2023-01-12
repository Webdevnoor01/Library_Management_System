const { Schema, model, Types } = require("mongoose");

const renewRequestSchema = Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
    },
    issuedBookId: {
      type: Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new model("RenewRequest", renewRequestSchema)