

const express = require("express");
const { loginUserController, protectedRouteController, removeFollowerController, addFollowerController, getAllUsersController, userByIdController, signUpUserController, otpVerifyController } = require("../controllers/userController");
const verify = require("../verify/verify")
const router = express.Router();

router.post("/login", loginUserController);
router.put("/addfollow", addFollowerController);
router.put("/removefollow", removeFollowerController);
router.get("/allUsers", getAllUsersController);
router.get("/protected", verify, protectedRouteController);
router.post("/login/verify", otpVerifyController);
router.get("/details/:id", userByIdController);
router.post("/signup", signUpUserController);

module.exports = router;