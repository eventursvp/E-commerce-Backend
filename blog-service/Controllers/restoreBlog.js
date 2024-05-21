const mongoose = require("mongoose")
const Blogs = require("model-hook/Model/blogModel")

exports.restoreBlog = async (req, res, next) => {
    try {
        const { userId, blogId } = req.body
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
        const checkBlog = await Blogs.findOne({ _id: blogId })
        if (!checkBlog) {
            return res.status(404).send({ status: 0, message: "Blog not found with given id." })
        }
        if (checkBlog.isDeleted === false) {
            return res.status(400).send({ status: 0, message: "This blog is already into blog list" })
        }

        const restoreBlog = await Blogs.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: false, status: "Draft" } }, { new: true })
        if (restoreBlog && restoreBlog.isDeleted === false) {
            return res.status(201).send({ status: 1, message: "Blog is restored successfully.", data: restoreBlog })
        }
        return res.status(400).send({ status: 0, message: "Blog is not restored, Please try again." })
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}