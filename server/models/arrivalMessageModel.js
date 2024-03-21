const mongoose = require("mongoose");
const arrivalMessageSchema = new mongoose.Schema({
    message: {
        text: {
            type: String,
            required: true
        }
    },
    reciever: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    sender: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },

}, { timestamps: true });
const model = mongoose.model("arrivalMessage", arrivalMessageSchema);

module.exports = model;