const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    post: {
        type: mongoose.Types.ObjectId,
        ref: "Post",
    },




}, { timestamps: true });
const model = mongoose.model("Comment", commentSchema);

module.exports = model;