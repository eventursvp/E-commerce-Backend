const mongoose = require("mongoose")
const Blogs = require("model-hook/Model/blogModel")
const BlogLikes = require("model-hook/Model/blogLikesModel")
const BlogComments = require("model-hook/Model/blogCommentsModel")
const BlogShare = require("model-hook/Model/blogShareModel")

exports.removeBlog = async (req, res, next) => {
    try {
        const { blogId, userId } = req.body
        const { loginUser } = req
        if (!userId) {
            return res.status(400).send({ status: 0, message: "User Id is required." })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: 0, message: "Invalid user id." });
        }
        if (loginUser?._id != userId || loginUser?.role !== "Admin") {
            return res.status(403).send({ status: 0, message: "Unauthorized access." })
        }
        if (!blogId) {
            return res.status(400).send({ status: 0, message: "Blog id is required." })
        }
        if (!mongoose.isValidObjectId(blogId)) {
            return res.status(400).send({ status: 0, message: "Invalid blog id." })
        }
        const data = await Blogs.findOne({
            _id: blogId,
            userId: userId
        })

        if (!data) {
            return res.status(404).send({ status: 0, message: "Data not found with given id" })
        }
        if (data.isDeleted === true) {
            return res.status(400).send({ status: 0, message: "This blog is already removed." })
        }
        const removeData = await Blogs.findOneAndUpdate({ _id: blogId, userId: userId }, { isDeleted: true, likes: 0 }, { new: true })
        if (removeData) {
            const deleteLikeData = await BlogLikes.deleteMany({ blogId: blogId })
            const deleteCommentData = await BlogComments.deleteMany({ blogId: blogId })
            const deleteShareData = await BlogShare.deleteMany({ blogId: blogId })
            return res.status(200).send({ status: 1, message: "Removed successfully...", data: removeData })
        }
        return res.status(500).send({ status: 0, message: "Blog not remove, Please try again" })
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}

exports.deleteBlog = async (req, res, next) => {
    try {
        const { blogId, userId } = req.body
        const { loginUser } = req
        if (!userId) {
            return res.status(400).send({ status: 0, message: "User Id is required." })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: 0, message: "Invalid user id." });
        }
        if (loginUser?._id != userId || loginUser?.role !== "Admin") {
            return res.status(403).send({ status: 0, message: "Unauthorized access." })
        }
        if (!blogId) {
            return res.status(400).send({ status: 0, message: "Blog id is required." })
        }
        if (!mongoose.isValidObjectId(blogId)) {
            return res.status(400).send({ status: 0, message: "Invalid blog id." })
        }
        const data = await Blogs.findOne({
            _id: blogId,
            userId: userId
        })

        if (!data) {
            return res.status(404).send({ status: 0, message: "Data not found with given id" })
        }

        const deleteData = await Blogs.findOneAndDelete({ _id: blogId, userId: userId })
        if (deleteData) {
            const deleteLikeData = await BlogLikes.deleteMany({ blogId: blogId })
            const deleteCommentData = await BlogComments.deleteMany({ blogId: blogId })
            const deleteShareData = await BlogShare.deleteMany({ blogId: blogId })
            return res.status(200).send({ status: 1, message: "Deleted successfully...", data: deleteData })
        }
        return res.status(500).send({ status: 0, message: "Blog not delete, Please try again" })
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}
