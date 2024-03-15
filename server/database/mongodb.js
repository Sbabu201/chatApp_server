const mongoose = require("mongoose")

const MongoDb = async () => {
    try {
        await mongoose.connect("mongodb+srv://socialMedia:socialMedia@cluster0.kyz5o2t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        console.log("connected to the database")
    } catch (error) {
        console.log('error', error)
    }
}

module.exports = MongoDb;