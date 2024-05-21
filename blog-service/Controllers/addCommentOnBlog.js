// const mongoose = require("mongoose")
// const BlogComments = require("model-hook/Model/blogCommentsModel")
// const Blogs = require("model-hook/Model/blogModel")

// exports.addCommentOnBlog = async (req, res, next) => {
//     try {
//         const { userId, blogId, comment } = req.body
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
//         if (!blogId) {
//             return res.status(400).send({ status: 0, message: "Blog id is required." })
//         }
//         if (!mongoose.isValidObjectId(blogId)) {
//             return res.status(400).send({ status: 0, message: "Invalid blog id." })
//         }
//         const checkBlog = await Blogs.findOne({ _id: blogId, status: "Published", isDeleted: false })
//         if (!checkBlog) {
//             return res.status(404).send({ status: 0, message: "Blog not found with given id" })
//         }
//         if (!comment) {
//             return res.status(400).send({ status: 0, message: "Comment is required." })
//         }
//         const addComment = await BlogComments.create({
//             comment,
//             userId,
//             blogId
//         })
//         if (addComment) {
//             const increaseCommentCount = await Blogs.findOneAndUpdate({ _id: blogId }, { $inc: { comment: 1 } }, { new: true })
//             return res.status(201).send({ status: 1, message: "Comment added", data: addComment })
//         }
//         return res.status(500).send({ status: 0, message: "Comment not added, Please try again." })
//     } catch (error) {
//         console.log('error =>', error);
//         return res.status(500).send({ status: 0, message: "Something went wrong", error });
//     }
// }

const mongoose = require("mongoose")
const BlogComments = require("model-hook/Model/blogCommentsModel")
const Blogs = require("model-hook/Model/blogModel")

exports.addCommentOnBlog = async (req, res, next) => {
    try {
        const { userId, blogId, comment, type, parentBlogCommentId } = req.body
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
        if (!blogId) {
            return res.status(400).send({ status: 0, message: "Blog id is required." })
        }
        if (!mongoose.isValidObjectId(blogId)) {
            return res.status(400).send({ status: 0, message: "Invalid blog id." })
        }
        const checkBlog = await Blogs.findOne({ _id: blogId, status: "Published", isDeleted: false })
        if (!checkBlog) {
            return res.status(404).send({ status: 0, message: "Blog not found with given id" })
        }
        if (type === "Child" && parentBlogCommentId) {
            const checkParentComment = await BlogComments.findOne({ _id: parentBlogCommentId, blogId: blogId, type: "Parent" })
            if (!checkParentComment) {
                return res.status(404).send({ status: 0, message: "Parent comment not found" })
            }
        }
        if (!comment) {
            return res.status(400).send({ status: 0, message: "Comment is required." })
        }
        if (comment.length > 200) {
            return res.status(400).send({ status: 0, message: "Comment must be maximum 200 character." })
        }
        const addComment = await BlogComments.create({
            comment,
            userId,
            blogId,
            type,
        })
        if (addComment) {
            const increaseCommentCount = await Blogs.findOneAndUpdate({ _id: blogId }, { $inc: { comment: 1 } }, { new: true })
            if (type === "Child") {
                const addChildToParent = await BlogComments.findOneAndUpdate({ _id: parentBlogCommentId }, { $push: { childBlogCommentId: addComment?._id } }, { new: true })
            }
            return res.status(201).send({ status: 1, message: "Comment added", data: addComment })
        }
        return res.status(500).send({ status: 0, message: "Comment not added, Please try again." })
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}