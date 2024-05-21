// const mongoose = require("mongoose")
// const BlogComments = require("model-hook/Model/blogCommentsModel")
// const Blogs = require("model-hook/Model/blogModel")

// exports.deleteComment = async (req, res, next) => {
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
//         const checkComment = await BlogComments.findOne({ _id: commentId, userId: userId })

//         if (!checkComment) {
//             return res.status(404).send({ status: 0, message: "Comment not found with given id" })
//         }
//         const deleteCommentData = await BlogComments.findOneAndDelete({ _id: commentId, userId: userId })
//         if (deleteCommentData) {
//             const decreaseCommentCount = await Blogs.findOneAndUpdate({ _id: checkComment?.blogId }, { $inc: { comment: -1 } }, { new: true })
//             return res.status(200).send({ status: 1, message: "Comment deleted", data: deleteCommentData })
//         }
//         return res.status(500).send({ status: 0, message: "Comment not deleted, Please try again" })


//     } catch (error) {
//         console.log('error =>', error);
//         return res.status(500).send({ status: 0, message: "Something went wrong", error });
//     }
// }

const mongoose = require("mongoose")
const BlogComments = require("model-hook/Model/blogCommentsModel")
const Blogs = require("model-hook/Model/blogModel")

exports.deleteComment = async (req, res, next) => {
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
        const checkComment = await BlogComments.findOne({ _id: commentId, userId: userId })

        if (!checkComment) {
            return res.status(404).send({ status: 0, message: "Comment not found with given id" })
        }

        if (checkComment.type === "Child") {
            const deleteCommentData = await BlogComments.findOneAndDelete({ _id: commentId, userId: userId })
            if (deleteCommentData) {
                const decreaseCommentCount = await Blogs.findOneAndUpdate({ _id: checkComment?.blogId }, { $inc: { comment: -1 } }, { new: true })
                const deleteFromParent = await BlogComments.findOneAndUpdate({ blogId: checkComment?.blogId, type: "Parent" }, { $pull: { childBlogCommentId: commentId } })
                return res.status(200).send({ status: 1, message: "Comment deleted", data: deleteCommentData })
            }
            return res.status(500).send({ status: 0, message: "Comment not deleted, Please try again" })
        }
        else {
            const allCommentIds = [checkComment?._id, ...checkComment?.childBlogCommentId]
            const deleteCommentData = await BlogComments.deleteMany({ _id: { $in: allCommentIds }, userId: userId })
            if (deleteCommentData && deleteCommentData?.deletedCount > 0) {
                const decreaseCommentCount = await Blogs.findOneAndUpdate({ _id: checkComment?.blogId }, { $inc: { comment: -allCommentIds.length } }, { new: true })
                return res.status(200).send({ status: 1, message: "Comment deleted", data: deleteCommentData })
            }
            return res.status(500).send({ status: 0, message: "Comment not deleted, Please try again" })
        }






    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}