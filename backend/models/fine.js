const { Schema, model, Types } = require("mongoose");

const fineSchema = Schema({
    amount: {
        type: Number,
        required: true,
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    bookId: {
        type: Types.ObjectId,
        required: true,
    },
    userId: {
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

const Fine = new model("Fine", fineSchema);
module.exports = Fine;