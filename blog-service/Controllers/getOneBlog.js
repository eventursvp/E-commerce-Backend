const mongoose = require("mongoose")
const Blogs = require("model-hook/Model/blogModel")

exports.getOneBlog = async (req, res, next) => {
    try {
        const { userId, blogId } = req.body
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
        let statusObj = {}
        if (loginUser?.role === "User") {
            statusObj = { status: "Published", isDeleted: false }
        } else {
            statusObj = { $or: [{ status: "Published" }, { status: "Draft" }] }
        }

        const data = await Blogs.findOne({
            _id: blogId,
            ...statusObj
        })

        if (data) {
            return res.status(200).send({ status: 1, message: "Data found", data: data })
        }
        return res.status(404).send({ status: 0, message: "Data not found with given id" })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}
