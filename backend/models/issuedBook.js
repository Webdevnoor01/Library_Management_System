const { Schema, model, Types } = require("mongoose");

const issuedBookSchema = Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
    },
    bookId: {
        type: Types.ObjectId,
        required: true,
        ref: "Book"
    },
    bookName: {
        type: String,
        require: true,
    },
    whoIssued: {
        type: String,
        required: true,
    },
    renewDate: {
        type: Date,
        default: Date.now()
    },
    isReturned: {
        type: Boolean,
        default: false,
    },
    libraryId: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

const IssuedBook = new model("IssuedBook", issuedBookSchema);
module.exports = IssuedBook;