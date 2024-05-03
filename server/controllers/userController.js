const userModel = require("../models/userModel")
const storyModel = require("../models/storyModel")
const otpGenerator = require("otp-generator");
const twilio = require("twilio");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const otpModel = require("../models/otpModel")
const token = "0763f43d4ac56643979df306cee96eca";
const sid = "ACc444c60df9e39f66ddbea9b7d6083f8a";
const phoneTeill = "+15415461650";
const clientTwilio = new twilio(sid, token);
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();
exports.protectedRouteController = async (req, res) => {
    try {
        const { user } = req.body;
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "enter valid to continue"
            })
        }


        const existUser = await userModel.findById({ user });
        // console.log('existUser', existUser)
        if (!existUser) {
            return res.status(400).send({
                success: false,
                message: "Number is not resistered"
            })
        }
        return res.status(201).send({
            success: true,
            message: "profile details got successfully    ",
            existUser
        })
    }
    catch (error) {
        console.log('error', error)
        return res.status(400).send({
            success: false,
            message: "something went wrong",
            error
        })
    }
}
exports.userByIdController = async (req, res) => {
    try {
        const user = req.params.id;
        // console.log('user', user)
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "enter valid to continue"
            })
        }


        const existUser = await userModel.findById(user).populate("posts").populate("followers").populate({
            path: 'following',
            populate: {
                path: 'story' // Specify the path to the nested schema you want to populate
            }
        }).populate("story");
        // console.log('existUser', existUser)
        if (!existUser) {
            return res.status(400).send({
                success: false,
                message: "Number is not resistered"
            })
        }
        return res.status(201).send({
            success: true,
            message: "profile details got successfully    ",
            existUser
        })
    }
    catch (error) {
        console.log('error', error)
        return res.status(400).send({
            success: false,
            message: "something went wrong",
            error
        })
    }
}
exports.loginUserController = async (req, res) => {
    try {
        const { phone } = req.body;
        const password2 = req.body.password
        if (!phone) {
            return res.status(400).send({
                success: false,
                message: "enter valid email to continue"
            })
        }
        if (!password2) {
            return res.status(400).send({
                success: false,
                message: "enter password to continue"
            })
        }
        const email = phone.toLowerCase()
        const existUser = await userModel.findOne({ email });
        // console.log('existUser', existUser)
        if (!existUser) {
            return res.status(400).send({
                success: false,
                message: "Email is not resistered"
            })
        }


        const cmpPass = await bcrypt.compare(password2, existUser.password);
        if (!cmpPass) {
            return res.status(400).send({
                success: false,
                message: "password is incorrect "
            })
        }


        const user = await userModel.findOne({ email: phone }).populate("posts").populate("followers").populate("following");
        const { password, ...info } = user._doc;
        const accessToken = jwt.sign({ id: user._id }, "secretKey1234", { expiresIn: "5d" });
        return res.status(201).send({
            message: "login successful",
            success: true,
            info, accessToken
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
exports.getAllUsersController = async (req, res) => {
    try {
        const usersWithoutPasswords = await userModel.find().populate("posts").populate("followers").populate("following").populate("story");
        if (usersWithoutPasswords) {
            // console.log('allUser', allUser)
            // const usersWithoutPasswords = allUser.map(user => {
            //     return { ...user, password: undefined };
            // });
            // console.log('usersWithoutPasswords', usersWithoutPasswords)
            return res.status(201).send({
                success: true,
                message: "all users got successfully   ",
                usersWithoutPasswords
            })
        }

    } catch (error) {
        console.log('error', error)
        res.status(400).send({
            success: false,
            message: "something went wrong",
            error
        })
    }
}

exports.otpVerifyController = async (req, res) => {
    try {
        const { otp, phone, email, name, password } = req.body;
        console.log('req.body', req.body)
        // console.log('otp', otp)
        if (!otp) {
            return res.status(400).send({
                success: false,
                message: " Otp is not getting"
            })
        }


        const existOtp = await otpModel.findOne({ phone: email });
        // console.log('existOtp', existOtp)
        if (!existOtp) {
            return res.status(400).send({
                success: false,
                message: "Email is not resistered"
            })
        }

        const compared = await bcrypt.compare(otp, existOtp?.otp)
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);
        // const compare = await bcrypt.compare(password, newPassword)
        const newUser = new userModel({ name, email, phone, password: newPassword });
        await newUser.save()
        if (compared) {
            return res.status(201).send({
                message: "Registration successful",
                success: true,
                newUser
            })

        }
        res.status(400).send({
            success: false,
            message: "Not registered"
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
exports.signUpUserController = async (req, res) => {
    try {
        // console.log('req.body', req.body)
        const { name, email, phone, password } = req.body;
        if (!phone || !name || !email || !password) {
            return res.status(400).send({
                success: false,
                message: "enter valid document to continue"
            })
        }
        const email2 = email.toLowerCase();

        const existUser = await userModel.find({ email: email2 });
        if (existUser.length > 0) {
            return res.status(200).send({
                success: false,
                message: "Email already exist "
            })
        }
        const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        const salt = await bcrypt.genSalt(10);
        const newOtp = await bcrypt.hash(otp, salt);
        await otpModel.findOneAndUpdate({
            phone: email2
        }, { otp: newOtp, expireTime: new Date(new Date().getTime()) },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "smohapatra2022@gift.edu.in",
                pass: "vpxmmqjfofxbwmux"
            }
        });
        const mailOptions = {
            from: `Soumyagram App`,
            to: email2, // Your email address
            subject: `otp for login`,
            text: `hi ${name} , Your OTP for login to our app  is  ${otp}`,
        };

        const info = await transporter.sendMail(mailOptions);

        res.status(201).send({
            success: true,
            message: "otp sent successfully    ",
            otp
        })
    } catch (error) {
        console.log('error', error)
        res.status(400).send({
            success: false,
            message: "something went wrong while resistering",
            error
        })
    }
}


// followers

exports.editUserController = async (req, res) => {
    try {
        const { profilePic, bio } = req.body;
        console.log('profilePic', profilePic)
        const id = req.params.id;
        let updateUser
        if (profilePic === null) {
            updateUser = await userModel.findByIdAndUpdate(id, { bio }, { new: true }).populate("posts").populate("followers").populate({
                path: 'following',
                populate: {
                    path: 'story' // Specify the path to the nested schema you want to populate
                }
            }).populate("story")
        }
        else {
            updateUser = await userModel.findByIdAndUpdate(id, { profilePic, bio }, { new: true }).populate("posts").populate("followers").populate({
                path: 'following',
                populate: {
                    path: 'story' // Specify the path to the nested schema you want to populate
                }
            }).populate("story");
        }
        return res.status(201).send({
            success: true,
            message: "Updated successfully ",
            updateUser
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

exports.addFollowerController = async (req, res) => {
    try {
        const { user, follower } = req.body;
        // console.log('first', user, follower)
        if (!user || !follower) {
            return res.status(400).send({
                success: false,
                message: "all fields are required "
            })
        }

        const updateFollowing = await userModel.findByIdAndUpdate(user, { $push: { following: follower } }, { new: true });
        const updateFollower = await userModel.findByIdAndUpdate(follower, { $push: { followers: user } });
        // console.log('newPost', newPost)
        if (updateFollowing && updateFollower) {
            return res.status(201).send({
                success: true,
                message: "following successfully ",
                updateFollowing
            })
        }

        return res.status(400).send({
            success: false,
            message: "failed to follow ",

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
exports.removeFollowerController = async (req, res) => {
    try {
        const { user, follower } = req.body;
        // console.log('first', user, follower)
        if (!user || !follower) {
            return res.status(400).send({
                success: false,
                message: "all fields are required "
            })
        }

        const updateFollowing2 = await userModel.findByIdAndUpdate(user, { $pull: { following: follower } }, { new: true });
        const updateFollowing = await userModel.findById(user).populate("posts").populate("followers").populate("following");;
        const updateFollower2 = await userModel.findByIdAndUpdate(follower, { $pull: { followers: user } });
        const updateFollower = await userModel.findById(follower).populate("posts").populate("followers").populate("following");;
        // console.log('newPost', newPost)
        if (updateFollowing && updateFollower) {
            return res.status(201).send({
                success: true,
                message: "unfollowed successfully ",
                updateFollowing, updateFollower
            })
        }

        return res.status(400).send({
            success: false,
            message: "failed to unfollow ",

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


// story controller 

// exports.addStoryController = async (req, res) => {
//     try {
//         const { title, content, user } = req.body;
//         // console.log('req.body', req.body)
//         // console.log('first', user, follower)
//         if (!user || !title || !content) {
//             return res.status(400).send({
//                 success: false,
//                 message: "all fields are required "
//             })
//         }

//         const addStory = new storyModel({
//             title, content, user, expiration: new Date(Date.now() + 24 * 60 * 60 * 1000)
//         })
//         await addStory.save()

//         return res.status(201).send({
//             success: true,
//             message: "following successfully ",
//             addStory
//         })



//     } catch (error) {
//         console.log('error', error)
//         return res.status(400).send({
//             success: false,
//             message: "something went wrong",
//             error
//         })
//     }
// }
// exports.removeStoryController = async (req, res) => {
//     try {
//         const { id } = req.params;
//         // console.log('first', id)
//         if (!id) {
//             return res.status(400).send({
//                 success: false,
//                 message: "all fields are required "
//             })
//         }

//         const deleteStory = await storyModel.findByIdAndDelete(id);
//         if (deleteStory) {
//             return res.status(201).send({
//                 success: true,
//                 message: "Deleted story successfully ",
//                 deleteStory
//             })
//         }

//         return res.status(400).send({
//             success: false,
//             message: "failed to delete ",

//         })


//     } catch (error) {
//         console.log('error', error)
//         return res.status(400).send({
//             success: false,
//             message: "something went wrong",
//             error
//         })
//     }
// }

exports.getAllStoryController = async (req, res) => {
    try {
        const allStory = await storyModel.find();
        if (allStory) {
            return res.status(201).send({
                success: true,
                message: "all Stories got successfully   ",
                allStory
            })
        }

    } catch (error) {
        console.log('error', error)
        res.status(400).send({
            success: false,
            message: "something went wrong",
            error
        })
    }
}

// Story Controller 



exports.addStoryController = async (req, res) => {
    try {
        const { title, content, user } = req.body;
        // console.log('first', user, follower)
        if (!user || !title || !content) {
            return res.status(400).send({
                success: false,
                message: "all fields are required "
            })
        }


        const addStory = new storyModel({
            title, content, user, expiration: new Date(Date.now() + 24 * 60 * 60 * 1000)
        })
        await addStory.save()
        console.log('addStory._id', addStory._id)
        const updateStory = await userModel.findByIdAndUpdate(user, { $push: { story: addStory._id } }, { new: true }).populate("posts").populate({
            path: 'following',
            populate: {
                path: 'story' // Specify the path to the nested schema you want to populate
            }
        }).populate("story").populate("followers");
        console.log('updateStory', updateStory)
        if (updateStory) {
            return res.status(201).send({
                success: true,
                message: "Story Updated successfully ",
                updateStory
            })
        }

        return res.status(400).send({
            success: false,
            message: "failed to follow ",

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
exports.removeStoryController = async (req, res) => {
    try {
        const { user, follower } = req.body;
        // console.log('first', user, follower)
        if (!user || !follower) {
            return res.status(400).send({
                success: false,
                message: "all fields are required "
            })
        }

        const updateFollowing2 = await userModel.findByIdAndUpdate(user, { $pull: { following: follower } }, { new: true });
        const updateFollowing = await userModel.findById(user).populate("posts").populate("followers").populate("following");;
        const updateFollower2 = await userModel.findByIdAndUpdate(follower, { $pull: { followers: user } });
        const updateFollower = await userModel.findById(follower).populate("posts").populate("followers").populate("following");;
        // console.log('newPost', newPost)
        if (updateFollowing && updateFollower) {
            return res.status(201).send({
                success: true,
                message: "unfollowed successfully ",
                updateFollowing, updateFollower
            })
        }

        return res.status(400).send({
            success: false,
            message: "failed to unfollow ",

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