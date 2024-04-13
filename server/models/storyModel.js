const mongoose = require("mongoose");
const storySchema = new mongoose.Schema({
    title: {
        type: String,
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    expiration: {
        type: Date,
        default: () => Date.now + 24 * 60 * 60 * 1000
    }




}, { timestamps: true });
const model = mongoose.model("Story", storySchema);

module.exports = model;