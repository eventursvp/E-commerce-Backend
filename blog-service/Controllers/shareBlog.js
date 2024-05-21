const mongoose = require("mongoose")
const Blogs = require("model-hook/Model/blogModel")
const BlogShare = require("model-hook/Model/blogShareModel")

exports.shareBlog = async (req, res, next) => {
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
        const checkBlog = await Blogs.findOne({ _id: blogId, isDeleted: false })
        if (!checkBlog) {
            return res.status(404).send({ status: 0, message: "Blog not found with given id." })
        }

        const data = await BlogShare.create({ blogId: blogId, userId: userId })
        if (data) {
            const shareBlog = await Blogs.findOneAndUpdate({ _id: blogId }, { $inc: { share: 1 } }, { new: true })
            if (shareBlog && shareBlog?.share > 0) {
                return res.status(200).send({ status: 1, message: "Blog is shared successfully.", data: shareBlog })
            }
        }
        return res.status(400).send({ status: 0, message: "Blog is not shared, Please try again." })
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}