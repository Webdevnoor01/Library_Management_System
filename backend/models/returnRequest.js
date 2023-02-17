const { Schema, model, Types } = require("mongoose");

const returnRequestSchema = Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
    },
    issuedBookId: {
        type: Types.ObjectId,
        required: true,
    },
    libraryId: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

module.exports = new model("ReturnRequest", returnRequestSchema)