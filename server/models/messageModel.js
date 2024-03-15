const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
    message: {
        text: {
            type: String,
            required: true
        }
    },
    users: Array,
    sender: {
        type: mongoose.Types.ObjectId,
        ref: "Post",
        required: true
    },

}, { timestamps: true });
const model = mongoose.model("message", messageSchema);

module.exports = model;