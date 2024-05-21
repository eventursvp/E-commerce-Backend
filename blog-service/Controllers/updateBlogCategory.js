const mongoose = require("mongoose")
const BlogCategories = require("model-hook/Model/blogCategoriesModel")

exports.updateBlogCategory = async (req, res, next) => {
    try {
        const { userId, blogCategoryId, categoryName } = req.body
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

        const checkCategory = await BlogCategories.findOne({ _id: blogCategoryId, userId: userId })

        if (!checkCategory) {
            return res.status(404).send({ status: 0, message: "Blog category not found with given id." })
        }

        let updateObj = {}
        if (categoryName) {
            updateObj.categoryName = categoryName
        }

        if (Object.entries(updateObj).length > 0) {
            const updateCategory = await BlogCategories.findOneAndUpdate({ _id: blogCategoryId, userId: userId }, updateObj, { new: true })

            if (updateCategory) {
                return res.status(201).send({ status: 1, message: "Blog category name updated.", data: updateCategory })
            }
        }
        return res.status(400).send({ status: 0, message: "Blog category name not updated, Please try again." })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}