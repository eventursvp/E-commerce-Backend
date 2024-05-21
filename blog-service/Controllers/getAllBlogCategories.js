const mongoose = require("mongoose")
const BlogCategories = require("model-hook/Model/blogCategoriesModel")

exports.getAllBlogCategories = async (req, res, next) => {
    try {
        const { userId } = req.body
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

        const data = await BlogCategories.find({})
        if (data && data?.length > 0) {
            return res.status(200).send({ status: 1, message: "Blog categories find.", data: data })
        }
        return res.status(404).send({ status: 0, message: "Empty set.", data: [] })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}