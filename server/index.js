const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const mongodb = require("./database/mongodb")
const http = require("http")
const socket = require("socket.io")
const app = express()

// socket 
// const server = http.createServer(app)

app.use(cors());
app.use(express.json());
mongodb()


// rourtes 

const userRoutes = require("./routes/userRoutes")
const postRoutes = require("./routes/postRoutes")
const messageRoute = require("./routes/messageRoute")

app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/message", messageRoute);
const PORT = process.env.PORT || 8080

//listen

const server = app.listen(PORT, () => {
    console.log(`backend started at ${PORT}`)
})

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "PUT"]
    }
})


global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;
    // console.log('connected socket', socket.id);
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    })
    socket.on("send-msg", (data) => {

        const sendUserSocket = onlineUsers.get(data.to);

        if (sendUserSocket) {
            // console.log('sendUserSocket', data.message)
            // alert("coming")
            socket.to(sendUserSocket).emit("catch", { from: data.from, message: data.message });
        }
    })
})