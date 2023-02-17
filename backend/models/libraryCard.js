const { Schema, model } = require("mongoose");
const { renewDate } = require("../util/generateRenewData");

const libraryCardSchema = new Schema({
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
    userRole: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

module.exports = model("LibraryCard", libraryCardSchema);