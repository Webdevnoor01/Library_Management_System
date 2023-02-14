const { Schema, model, Types } = require("mongoose");

const requestedBookSchema = Schema({
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
    }
});

const RequestedBook = new model("RequestedBook", requestedBookSchema);

module.exports = RequestedBook;