const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    name: {
        type: String,

    },
    title: {
        type: String,
        required: true
    },
    image: [{
        type: String,
        default: ""
    }]
    ,

    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: "Like",
    }],
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: "Comment",
    }],



}, { timestamps: true });
const model = mongoose.model("Post", postSchema);

module.exports = model;