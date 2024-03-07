const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const mongodb = require("./database/mongodb")

const app = express()
mongodb()
app.use(cors());
app.use(express.json());





const PORT = process.env.PORT || 8080

//listen

app.listen(PORT, () => {
    console.log(`backend started at ${PORT}`)
})