const { Schema, model, Types } = require("mongoose");

const refreshToken = new Schema({
    token: {
        type: String,
        required: true,
    },
    userId: {
        type: Types.ObjectId,
        required: true,
        ref: "Student",
    },
}, {
    timestapms: true,
});

module.exports = model("RefreshTokens", refreshToken);