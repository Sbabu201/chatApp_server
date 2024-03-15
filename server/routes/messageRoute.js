const express = require("express");
const { addMessageController, getAllMessageController } = require("../controllers/messageController");
const router = express.Router();
router.post("/allMessage", getAllMessageController);
router.post("/addMessage", addMessageController);

module.exports = router;