const mongoose = require("mongoose");
const likeSchema = new mongoose.Schema({

    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    post: {
        type: mongoose.Types.ObjectId,
        ref: "Post",
    },




}, { timestamps: true });
const model = mongoose.model("Like", likeSchema);

module.exports = model;