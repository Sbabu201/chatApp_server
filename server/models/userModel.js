const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1712657694~exp=1712661294~hmac=38da83f808b770f2f6a5bddb5bb883c504581b613be5414516b880cb7dbc103e&w=740"
    },
    bio: {
        type: String,
        default: ""
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    posts: [{
        type: mongoose.Types.ObjectId,
        ref: "Post",
    }],
    story: [{
        type: mongoose.Types.ObjectId,
        ref: "Story",
    }]

}, { timestamps: true })
const model = mongoose.model("User", userSchema)
module.exports = model