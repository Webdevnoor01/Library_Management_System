const { Schema, model, Types } = require("mongoose");
const { renewDate } = require("../util/generateRenewData");

const libraryCardSchema = Schema({
    userName: {
        type: String,
        required: true,
    },
    issueDate: {
        type: String,
        required: true,
    },
    expireDate: {
        type: String,
        default: renewDate(365 * 3),
    },
    libraryId: {
        type: String,
        required: true,
    },
    bookLimit: {
        type: Number,
        required: true,
    },
    bookCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

const LibraryCard = new model("LibraryCard", libraryCardSchema);

module.exports = LibraryCard;