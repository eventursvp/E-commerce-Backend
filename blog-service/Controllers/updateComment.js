// const mongoose = require("mongoose")
// const BlogComments = require("model-hook/Model/blogCommentsModel")

// exports.updateComment = async (req, res, next) => {
//     try {
//         const { userId, commentId, comment } = req.body
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
//         const checkComment = await BlogComments.findOne({ _id: commentId, userId: userId })
//         if (!checkComment) {
//             return res.status(404).send({ status: 0, message: "Comment not found with given id" })
//         }
//         if (!comment) {
//             return res.status(400).send({ status: 0, message: "Comment is required." })
//         }
//         const updateComment = await BlogComments.findOneAndUpdate({ _id: commentId, userId: userId }, { comment: comment }, { new: true })

//         if (updateComment) {
//             return res.status(201).send({ status: 1, message: "Comment updated.", data: updateComment })
//         }

//         return res.status(500).send({ status: 0, message: "Comment not updated, Please try again." })

//     } catch (error) {
//         console.log('error =>', error);
//         return res.status(500).send({ status: 0, message: "Something went wrong", error });
//     }
// }

const mongoose = require("mongoose")
const BlogComments = require("model-hook/Model/blogCommentsModel")

exports.updateComment = async (req, res, next) => {
    try {
        const { userId, commentId, comment } = req.body
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
        const checkComment = await BlogComments.findOne({ _id: commentId, userId: userId })
        if (!checkComment) {
            return res.status(404).send({ status: 0, message: "Comment not found with given id" })
        }
        if (!comment) {
            return res.status(400).send({ status: 0, message: "Comment is required." })
        }
        if (comment.length > 200) {
            return res.status(400).send({ status: 0, message: "Comment must be maximum 200 character." })
        }
        const updateComment = await BlogComments.findOneAndUpdate({ _id: commentId, userId: userId }, { comment: comment }, { new: true })

        if (updateComment) {
            return res.status(201).send({ status: 1, message: "Comment updated.", data: updateComment })
        }

        return res.status(500).send({ status: 0, message: "Comment not updated, Please try again." })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}