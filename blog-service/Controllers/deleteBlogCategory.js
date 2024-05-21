const mongoose = require("mongoose")
const BlogCategories = require("model-hook/Model/blogCategoriesModel")

exports.deleteBlogCategory = async (req, res, next) => {
    try {
        const { userId, blogCategoryId } = req.body
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
        if (!blogCategoryId) {
            return res.status(400).send({ status: 0, message: "Blog Category id is required." })
        }
        if (!mongoose.isValidObjectId(blogCategoryId)) {
            return res.status(400).send({ status: 0, message: "Invalid blog category id." });
        }

        const CheckBlogCategory = await BlogCategories.findOne({ _id: blogCategoryId, userId: userId })
        if (!CheckBlogCategory) {
            return res.status(404).send({ status: 0, message: "Blog category not found with given id." })
        }
        const deleteCategory = await BlogCategories.findOneAndDelete({ _id: blogCategoryId, userId: userId })
        if (deleteCategory) {
            return res.status(200).send({ status: 1, message: "Blog category deleted", data: deleteCategory })
        }
        return res.status(500).send({ status: 0, message: "Blog category not deleted, Please try again." })
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}