const mongoose = require("mongoose")
const BlogCategories = require("model-hook/Model/blogCategoriesModel")

exports.addBlogCategory = async (req, res, next) => {
    try {
        const { userId, blogCategoryName } = req.body
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
        if (!blogCategoryName) {
            return res.status(400).send({ status: 0, message: "Category name is required." })
        }
        if (blogCategoryName?.length > 50) {
            return res.status(400).send({ status: 0, message: "Blog Category must be 50 character." })
        }
        const checkCategory = await BlogCategories.findOne({ categoryName: blogCategoryName, userId: userId })
        if (checkCategory) {
            return res.status(400).send({ status: 0, message: "This category name already exist." })
        }

        const addBlogCategory = await BlogCategories.create({
            categoryName: blogCategoryName,
            userId
        })

        if (addBlogCategory) {
            return res.status(201).send({ status: 1, message: "Blog category added.", data:addBlogCategory })
        }
        return res.status(500).send({ status: 0, message: "Blog category not added, Please try again." })
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}