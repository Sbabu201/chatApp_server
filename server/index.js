const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const mongodb = require("./database/mongodb")
const http = require("http")
const socket = require("socket.io")
const app = express()

// socket 
// const server = http.createServer(app)

// const allowedOrigins = [`http://localhost:3000/`];

// app.use(cors({
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     }
// }));
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
        // origin: "https://chat-app-client-ebon.vercel.app",
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
})


global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;
    console.log('connected socket', onlineUsers);
    socket.on("add-user", (userId) => {
        // console.log('userId', userId)
        onlineUsers.set(userId, socket.id);
    })
    socket.on("send-msg", (data) => {

        const sendUserSocket = onlineUsers.get(data.to);
        console.log('sendUserSocket', sendUserSocket)
        if (sendUserSocket) {
            console.log('data', data)
            socket.to(sendUserSocket).emit("catch", { from: data.from, to: data.to, message: data.message });
        }
    })
    socket.on("send-notify", (data) => {
        // console.log('data', data)
        const sendUserSocket = onlineUsers.get(data.owner);
        // console.log('sendUserSocket', sendUserSocket)

        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("notify", { user: data.user, message: data.message });
        }
    })
})