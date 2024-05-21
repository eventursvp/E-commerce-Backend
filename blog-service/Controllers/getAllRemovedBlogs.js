const mongoose = require("mongoose")
const Blogs = require("model-hook/Model/blogModel")
const BlogCategories = require("model-hook/Model/blogCategoriesModel")
const { constants } = require("model-hook/common_function/constants")

exports.getAllRemovedBlogs = async (req, res, next) => {
    try {
        const { userId, search, status, page = 1, limit = 10, blogCategoryId } = req.body
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

        if (!constants.numberRegex.test(limit) || limit <= 0) {
            return res.status(400).send({ status: 0, message: "Invalid limit value" })
        }
        if (!constants.numberRegex.test(page) || page <= 0) {
            return res.status(400).send({ status: 0, message: "Invalid page value" })
        }

        let query = {}

        if (search) {
            if (!constants.searchPattern.test(search)) {
                return res.status(400).send({ status: 0, message: "Invalid search input" });
            }
            query = {
                $or: [
                    { title: { $regex: new RegExp(search, "i"), }, },
                    { description: { $regex: new RegExp(search, "i"), }, },
                ],
            };
        }

        if (blogCategoryId) {
            if (!mongoose.isValidObjectId(blogCategoryId)) {
                return res.status(400).send({ status: 0, message: "Invalid blog category id." })
            }
            const checkBlogCategory = await BlogCategories.findOne({ _id: blogCategoryId })
            if (!checkBlogCategory) {
                return res.status(404).send({ status: 0, message: "Blog category not found with given id." })
            }
            query = {
                ...query,
                blogCategoryId: new mongoose.Types.ObjectId(blogCategoryId)
            }
        }

        if (status) {
            if (!["Published", "Draft"].includes(status)) {
                return res.status(400).send({ status: 0, message: "Invalid status." })
            }
            query = {
                ...query,
                status: status
            }
        }

        let numberLimit = Number(limit) || 10;
        let numberSkip = (Number(page) - 1) * Number(limit) || 0;

        const blogData = await Blogs.aggregate([
            {
                $match: {
                    isDeleted: true,
                    ...query
                }
            },
            {
                $skip: numberSkip
            },
            {
                $limit: numberLimit
            }
        ])

        if (blogData.length > 0) {
            return res.status(200).send({ status: 1, message: "Data found", data: blogData })
        }
        return res.status(404).send({ status: 0, message: "Empty set", data: [] })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}
