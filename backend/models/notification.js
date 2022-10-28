const { Schema, model, Types } = require("mongoose");

const notificaitonSchema = Schema(
  {
    message: {
      type: String,
      required: true,
    },
    sender: {
      role: {
        type: String,
        required: true,
      },
      userId: {
        type: Types.ObjectId,
        required: true,
      },
      userName: {
        type: String,
        required: true,
      },
    },
    reciever: {
      role: {
        type: Array  || String,
        required: true,
      },
      userId: {
        typw: Types.ObjectId,
      },
      userName: {
        type: String,
      },
    },
    isMarked:{
      type:Boolean,
      required:true,
      default:false
    }
  },
  { timestamps: true }
);

module.exports = new model("Notification",notificaitonSchema)
