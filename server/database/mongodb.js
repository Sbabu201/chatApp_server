const mongoose = require("mongoose")

const MongoDb = async () => {
    try {
        await mongoose.connect("mongodb+srv://soumya:soumya@cluster0.rxfhjjq.mongodb.net/")
        console.log("connected to the database")
    } catch (error) {
        console.log('error', error)
    }
}

module.exports = MongoDb;