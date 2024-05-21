// const mongoose = require("mongoose")
// const BlogComments = require("model-hook/Model/blogCommentsModel")

// exports.giveLikeToComment = async (req, res, next) => {
//     try {
//         const { userId, commentId } = req.body
//         const { loginUser } = req
//         if (!userId) {
//             return res.status(400).send({ status: 0, message: "User Id is required." })
//         }
//         if (!mongoose.isValidObjectId(userId)) {
//             return res.status(400).send({ status: 0, message: "Invalid user id." });
//         }
//         if (loginUser?._id != userId || !["User", "Admin"].includes(loginUser?.role)) {
//             return res.status(403).send({ status: 0, message: "Unauthorized access." })
//         }
//         if (!commentId) {
//             return res.status(400).send({ status: 0, message: "comment id is required." })
//         }
//         if (!mongoose.isValidObjectId(commentId)) {
//             return res.status(400).send({ status: 0, message: "Invalid comment id." })
//         }
//         const checkComment = await BlogComments.findOne({ _id: commentId })

//         if (!checkComment) {
//             return res.status(404).send({ status: 0, message: "Comment not found with given id" })
//         }

//         if (checkComment?.likesUser.includes(userId)) {
//             const decreaseCommentLike = await BlogComments.findOneAndUpdate({ _id: commentId }, { $pull: { likesUser: userId } }, { new: true })
//             if (decreaseCommentLike) {
//                 return res.status(201).send({ status: 1, message: "Like is retrieve from comment", data: decreaseCommentLike })
//             }
//             return res.status(400).send({ status: 0, message: "Like is not retrieve from comment, Please try again." })
//         } else {
//             const increaseCommentLike = await BlogComments.findOneAndUpdate({ _id: commentId }, { $push: { likesUser: userId } }, { new: true })

//             if (increaseCommentLike) {
//                 return res.status(201).send({ status: 1, message: "Like is give to comment", data: increaseCommentLike })
//             }
//             return res.status(400).send({ status: 0, message: "Like is not given to comment, Please try again." })
//         }

//     } catch (error) {
//         console.log('error =>', error);
//         return res.status(500).send({ status: 0, message: "Something went wrong", error });
//     }
// }

const mongoose = require("mongoose")
const BlogComments = require("model-hook/Model/blogCommentsModel")

exports.giveLikeToComment = async (req, res, next) => {
    try {
        const { userId, commentId } = req.body
        const { loginUser } = req
        if (!userId) {
            return res.status(400).send({ status: 0, message: "User Id is required." })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: 0, message: "Invalid user id." });
        }
        if (loginUser?._id != userId || !["User", "Admin"].includes(loginUser?.role)) {
            return res.status(403).send({ status: 0, message: "Unauthorized access." })
        }
        if (!commentId) {
            return res.status(400).send({ status: 0, message: "comment id is required." })
        }
        if (!mongoose.isValidObjectId(commentId)) {
            return res.status(400).send({ status: 0, message: "Invalid comment id." })
        }
        const checkComment = await BlogComments.findOne({ _id: commentId })

        if (!checkComment) {
            return res.status(404).send({ status: 0, message: "Comment not found with given id" })
        }

        if (checkComment?.likesUser.includes(userId)) {
            const decreaseCommentLike = await BlogComments.findOneAndUpdate({ _id: commentId }, { $pull: { likesUser: userId } }, { new: true })
            if (decreaseCommentLike) {
                return res.status(201).send({ status: 1, message: "Like is retrieve from comment", data: decreaseCommentLike })
            }
            return res.status(400).send({ status: 0, message: "Like is not retrieve from comment, Please try again." })
        } else {
            const increaseCommentLike = await BlogComments.findOneAndUpdate({ _id: commentId }, { $push: { likesUser: userId } }, { new: true })

            if (increaseCommentLike) {
                return res.status(201).send({ status: 1, message: "Like is give to comment", data: increaseCommentLike })
            }
            return res.status(400).send({ status: 0, message: "Like is not given to comment, Please try again." })
        }

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}