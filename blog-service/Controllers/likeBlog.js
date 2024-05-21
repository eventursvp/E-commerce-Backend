const mongoose = require("mongoose")
const Blogs = require("model-hook/Model/blogModel")
const BlogLikes = require("model-hook/Model/blogLikesModel")

exports.likeBlog = async (req, res, next) => {
    try {
        const { userId, blogId } = req.body
        const { loginUser } = req

        if (!userId) {
            return res.status(400).send({ status: 0, message: "User Id is required." })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: 0, message: "Invalid user id." });
        }
        if (loginUser?._id != userId || !["Admin", "User"].includes(loginUser?.role)) {
            return res.status(403).send({ status: 0, message: "Unauthorized access." })
        }

        if (!blogId) {
            return res.status(400).send({ status: 0, message: "Blog id is required." })
        }
        if (!mongoose.isValidObjectId(blogId)) {
            return res.status(400).send({ status: 0, message: "Invalid blog id." })
        }
        const checkBlog = await Blogs.findOne({ _id: blogId, isDeleted: false, status: "Published" })
        if (!checkBlog) {
            return res.status(404).send({ status: 0, message: "Blog not found with given id." })
        }

        const alreadyLiked = await BlogLikes.findOne({ userId: userId, blogId: blogId })
        if (alreadyLiked) {
            const removeAlreadyLikeData = await BlogLikes.findOneAndDelete({ userId: userId, blogId: blogId })
            if (removeAlreadyLikeData) {
                const decreaseLike = await Blogs.findOneAndUpdate({ _id: blogId }, { $inc: { likes: -1 } }, { new: true })
                if (decreaseLike) {
                    return res.status(201).send({ status: 1, message: "Blog unlike successfully.", data: decreaseLike })
                }
            } else {
                return res.status(400).send({ status: 0, message: "Blog not unlike,Please try again. " })
            }
        } else {
            const createBlogLikeData = await BlogLikes.create({ userId: userId, blogId: blogId })
            if (createBlogLikeData) {
                const increaseLike = await Blogs.findByIdAndUpdate({ _id: blogId }, { $inc: { likes: 1 } }, { new: true })
                if (increaseLike) {
                    return res.status(201).send({ status: 1, message: "Blog like successfully.", data: increaseLike })
                }
            }
            else {
                return res.status(400).send({ status: 0, message: "Blog not like,Please try again. " })
            }
        }

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}
