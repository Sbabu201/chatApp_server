const express = require("express");
const { addMessageController, getAllMessageController, addArrivalMessageController, removeArrivalMessageController, getAllArrivalMessageController } = require("../controllers/messageController");
const router = express.Router();
router.post("/allMessage", getAllMessageController);
router.post("/allArrival", getAllArrivalMessageController);
router.delete("/deleteArrival/:id", removeArrivalMessageController);

router.post("/addMessage", addMessageController);
router.post("/addArrival", addArrivalMessageController);

module.exports = router;