const { Schema, model, Types } = require("mongoose");

const requestedBookSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        references: [
            { type: Types.ObjectId, ref: "Teacher" },
            { type: Types.ObjectId, ref: "Student" },
        ],
        required: true,
    },
    bookId: {
        type: Types.ObjectId,
        required: true,
        ref: "Book",
    },
    libraryId: {
        type: String,
        required: true
    }
});

const RequestedBook = model("RequestedBook", requestedBookSchema);

module.exports = RequestedBook;