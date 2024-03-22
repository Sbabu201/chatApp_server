const postModel = require("../models/postModel")
const userModel = require("../models/userModel")
const likeModel = require("../models/likeModel")
const commentModel = require("../models/commentModel")
exports.getPostByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('id', id);
        const existUser = await postModel.findById(id);
        // console.log('existUser', existUser)


        res.status(201).send({
            success: true,
            message: "post got successfully    ",
            existUser
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
exports.getAllPostController = async (req, res) => {
    try {

        const allPosts = await postModel.find().populate("user").populate({
            path: 'likes',
            populate: {
                path: 'user',
                model: 'User'
            }
        }).populate({
            path: 'comments',
            populate: {
                path: 'user',
                model: 'User'
            }
        });
        // console.log('existUser', existUser)
        if (allPosts.length === 0) {
            return res.status(400).send({
                success: false,
                message: "No post is there .............."
            })
        }
        res.status(201).send({
            success: true,
            message: "all posts got successfully",
            allPosts
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
exports.editPostController = async (req, res) => {
    try {

        const allPosts = await postModel.find();
        // console.log('existUser', existUser)
        if (allPosts.length === 0) {
            return res.status(400).send({
                success: false,
                message: "No post is there .............."
            })
        }
        res.status(201).send({
            success: true,
            message: "all posts got successfully",
            allPosts
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
exports.addPostController = async (req, res) => {
    try {
        const { name, title, image, user } = req.body;
        if (!name || !title || !image || !user) {
            return res.status(400).send({
                success: false,
                message: "all fields are required "
            })
        }

        const newPosts = new postModel({ name, title, image, user })
        if (newPosts) {
            const updatedUSer = await userModel.updateOne({ _id: user }, { $push: { posts: newPosts._id } });
            if (updatedUSer) {
                await newPosts.save();
                const newPost = await postModel.findById(newPosts._id).populate("user");
                return res.status(201).send({
                    success: true,
                    message: "posted  successfully ",
                    newPost
                })

            }
        }
        res.status(400).send({
            success: false,
            message: "failed to post ",

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
exports.deletePostController = async (req, res) => {
    try {
        const id = req.params.id;
        const deletePost = await postModel.findByIdAndDelete(id);
        // console.log('existUser', existUser)
        if (deletePost)
            res.status(201).send({
                success: true,
                message: " posts deleted successfully",
                deletePost
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

// likes controllers 

exports.getAllLikeController = async (req, res) => {
    try {

        const allLikes = await likeModel.find().populate("user").populate("post");
        // console.log('allLikes', allLikes)
        res.status(201).send({
            success: true,
            message: "all likes got successfully",
            allLikes
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

exports.addToLikeController = async (req, res) => {
    try {
        const { post, user } = req.body;
        if (!post || !user) {
            return res.status(400).send({
                success: false,
                message: "all fields are required "
            })
        }
        const existLike = await likeModel.findOne({ user, post });
        if (existLike) {
            return res.status(400).send({
                success: false,
                message: "failed to like ",

            })
        }
        const newPosts = new likeModel({ post, user })
        // console.log('newPosts', newPosts)
        if (newPosts) {
            const updatedUSer = await postModel.updateOne({ _id: post }, { $push: { likes: newPosts._id } });
            await newPosts.save();
            const newPost = await likeModel.findById(newPosts._id).populate("user").populate("post");
            // console.log('newPost', newPost)
            return res.status(201).send({
                success: true,
                message: "liked  successfully ",
                newPost
            })

        }
        return res.status(400).send({
            success: false,
            message: "failed to post ",

        })


    } catch (error) {
        console.log('error', error)
        return res.status(400).send({
            success: false,
            message: "something went wrong",
            error
        })
    }
}
exports.deleteLikeController = async (req, res) => {
    try {
        const { bagItemId } = req.body;
        // console.log('req.body', bagItemId)
        // console.log('first', user, post)
        if (!bagItemId?.user || !bagItemId?.post) {
            return res.status(400).send({
                success: false,
                message: "all fields are required "
            })
        }
        const deleteLike = await likeModel.findOneAndDelete({ user: bagItemId?.user, post: bagItemId?.post });
        if (deleteLike) {
            const updatedpost = await postModel.updateOne({ _id: bagItemId?.post }, { $pull: { likes: deleteLike._id } }, { new: true })
            return res.status(201).send({
                success: true,
                message: "unliked  successfully ",
                deleteLike
            })

        }
        return res.status(400).send({
            success: false,
            message: "failed to like ",

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


// comment controllers 


exports.getAllCommentController = async (req, res) => {
    try {

        const allComents = await commentModel.find().populate("user").populate("post");
        //  console.log('allLikes', allLikes)
        res.status(201).send({
            success: true,
            message: "all comments got successfully",
            allComents
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

exports.addCommentController = async (req, res) => {
    try {
        const { post, user, comment } = req.body;
        if (!post || !user || !comment) {
            return res.status(400).send({
                success: false,
                message: "all fields are required "
            })
        }

        const newComments = new commentModel({ post, user, comment })
        // console.log('newPosts', newPosts)
        if (newComments) {
            const updatePost = await postModel.updateOne({ _id: post }, { $push: { comments: newComments._id } });
            await newComments.save();
            const newComment = await commentModel.findById(newComments._id).populate("user").populate("post");
            // console.log('newPost', newPost)
            return res.status(201).send({
                success: true,
                message: "commented successfully ",
                newComment
            })

        }
        return res.status(400).send({
            success: false,
            message: "failed to comment ",

        })


    } catch (error) {
        console.log('error', error)
        return res.status(400).send({
            success: false,
            message: "something went wrong",
            error
        })
    }
}
exports.deleteCommentController = async (req, res) => {
    try {
        const { bagItemId } = req.body;
        // console.log('req.body', bagItemId)
        // console.log('first', user, post)
        if (!bagItemId?.user || !bagItemId?.post) {
            return res.status(400).send({
                success: false,
                message: "all fields are required "
            })
        }
        const deleteLike = await likeModel.findOneAndDelete({ user: bagItemId?.user, post: bagItemId?.post });
        if (deleteLike) {
            const updatedpost = await postModel.updateOne({ _id: bagItemId?.post }, { $pull: { likes: deleteLike._id } }, { new: true })
            return res.status(201).send({
                success: true,
                message: "unliked  successfully ",
                deleteLike
            })

        }
        return res.status(400).send({
            success: false,
            message: "failed to like ",

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