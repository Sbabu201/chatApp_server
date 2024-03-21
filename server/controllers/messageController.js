const messageModel = require("../models/messageModel")
const arrivalMessageModel = require("../models/arrivalMessageModel")
exports.getAllMessageController = async (req, res) => {
    try {
        // console.log('req.body', req.body)
        const { from, to } = req.body;
        const messages = await messageModel.find({
            users: {
                $all: [from, to],
            }
        }).sort({ updatedAt: 1 });

        const projectMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text
            }
        })
        return res.status(201).send({
            success: true,
            message: "all messages got successfully   ",
            projectMessages
        })


    } catch (error) {
        console.log('error', error)
        res.status(400).send({
            success: false,
            message: "something went wrong",
            error
        })
    }
}
exports.getAllArrivalMessageController = async (req, res) => {
    try {
        // console.log('req.body', req.body)
        const { to } = req.body;
        const messages = await arrivalMessageModel.find({
            reciever: to
        }).sort({ updatedAt: 1 });
        // console.log('messages', messages)
        return res.status(201).send({
            success: true,
            message: "all arrival messages got successfully   ",
            messages
        })


    } catch (error) {
        console.log('error', error)
        res.status(400).send({
            success: false,
            message: "something went wrong",
            error
        })
    }
}


exports.addMessageController = async (req, res) => {
    try {
        const { from, to, message } = req.body;
        if (!to || !from || !message) {
            return res.status(400).send({
                success: false,
                message: "enter valid document to continue"
            })
        }

        const newMessages = new messageModel({
            message: { text: message },
            users: [from, to],
            sender: from
        });
        await newMessages.save()
        res.status(201).send({
            success: true,
            message: "message sent ",
            newMessages
        })
    } catch (error) {
        console.log('error', error)
        console.log('error', error)
        res.status(400).send({
            success: false,
            message: "something went wrong while resistering",
            error
        })
    }
}


exports.addArrivalMessageController = async (req, res) => {
    try {
        const { from, to, message } = req.body;
        if (!to || !from || !message) {
            return res.status(400).send({
                success: false,
                message: "enter valid document to continue"
            })
        }

        const arrivalMessage = new arrivalMessageModel({
            message: { text: message },
            sender: from,
            reciever: to
        });
        await arrivalMessage.save()
        res.status(201).send({
            success: true,
            message: "message recieved ",
            arrivalMessage
        })
    } catch (error) {
        console.log('error', error)
        res.status(400).send({
            success: false,
            message: "something went wrong while getting messages",
            error
        })
    }
}
exports.removeArrivalMessageController = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('id', id)
        if (!id) {
            return res.status(400).send({
                success: false,
                message: "enter valid document to continue"
            })
        }

        const deleteMessages = await arrivalMessageModel.deleteMany({
            sender: id
        });

        if (deleteMessages) {
            return res.status(201).send({
                success: true,
                message: "message deleted ",
                deleteMessages
            })
        }
        return res.status(401).send({
            success: false,
            message: "not deleted "
        })
    } catch (error) {
        console.log('error', error)
        console.log('error', error)
        res.status(400).send({
            success: false,
            message: "something went wrong while resistering",
            error
        })
    }
}


