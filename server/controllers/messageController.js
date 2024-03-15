const messageModel = require("../models/messageModel")

exports.getAllMessageController = async (req, res) => {
    try {
        console.log('req.body', req.body)
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


