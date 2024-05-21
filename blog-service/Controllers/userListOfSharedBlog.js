const mongoose = require("mongoose")
const Blogs = require("model-hook/Model/blogModel")
const BlogShare = require("model-hook/Model/blogShareModel")
const Users = require("model-hook/Model/userModel")

exports.userListOfSharedBlog = async (req, res, next) => {
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

        const data = await BlogShare.find({ blogId: blogId })
        if (data && data?.length > 0) {
            const userIds = await Promise.all(data.map((data) => {
                return data.userId
            }))
            const userData = await Users.find({ _id: { $in: userIds } }).select("firstName lastName")
            if (userData && userData?.length > 0) {
                return res.status(200).send({ status: 1, message: "List found successfully.", data: userData })
            }
        }
        return res.status(404).send({ status: 0, message: "Empty set", data: [] })
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}