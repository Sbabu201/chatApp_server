const express = require("express");
const { addPostController, deleteLikeController, deleteCommentController, addCommentController, getAllCommentController, deletePostController, addToLikeController, getAllLikeController, editPostController, getPostByIdController, getAllPostController } = require("../controllers/postController");

const router = express.Router();

router.get("/post/:id", getPostByIdController);
router.get("/allPost", getAllPostController);
router.put("/editPost/:id", editPostController)
router.delete("/deletePost/:id", deletePostController)
router.post("/create", addPostController);
router.get("/allLikes", getAllLikeController);
router.post("/addLike", addToLikeController);
router.delete("/deleteLike", deleteLikeController);
router.get("/allComments", getAllCommentController);
router.post("/addComment", addCommentController);
router.delete("/deleteComment", deleteCommentController);

module.exports = router;