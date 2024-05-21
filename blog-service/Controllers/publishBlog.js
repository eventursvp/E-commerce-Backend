const mongoose = require("mongoose")
const Blogs = require("model-hook/Model/blogModel")

exports.publishBlog = async (req, res, next) => {
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
        const checkBlog = await Blogs.findOne({ _id: blogId, isDeleted: false })
        if (!checkBlog) {
            return res.status(404).send({ status: 0, message: "Blog not found with given id." })
        }

        if (checkBlog.status === "Published") {
            return res.status(400).send({ status: 0, message: "This blog is already published." })
        }

        const updateBlog = await Blogs.findOneAndUpdate({ _id: blogId, userId: userId }, { status: "Published" }, { new: true })

        if (updateBlog) {
            return res.status(201).send({ status: 1, message: "Blog is published", data: updateBlog })
        }
        return res.status(500).send({ status: 0, message: "Blog not published, Please try again." })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}
