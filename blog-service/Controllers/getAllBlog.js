const mongoose = require("mongoose")
const Blogs = require("model-hook/Model/blogModel")
const { constants } = require("model-hook/common_function/constants")
const BlogCategories = require("model-hook/Model/blogCategoriesModel")

exports.getAllBlogForUser = async (req, res, next) => {
    try {
        const { search, limit = 10, page = 1, blogCategoryId } = req.body
        // const { loginUser } = req
        // if (!userId) {
        //     return res.status(400).send({ status: 0, message: "User Id is required." })
        // }
        // if (!mongoose.isValidObjectId(userId)) {
        //     return res.status(400).send({ status: 0, message: "Invalid user id." });
        // }
        // if (loginUser?._id != userId || loginUser?.role !== "User") {
        //     return res.status(403).send({ status: 0, message: "Unauthorized access." })
        // }

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

        const totalCount = await Blogs.countDocuments({
            status: "Published",
            isDeleted: false,
        });

        let numberLimit = Number(limit) || 10;
        let numberSkip = (Number(page) - 1) * Number(limit) || 0;

        const data = await Blogs.aggregate([
            {
                $match: {
                    status: "Published",
                    isDeleted: false,
                    ...query
                }
            },
            {
                $skip: numberSkip
            },
            {
                $limit: numberLimit
            },
        ])

        if (data.length > 0) {
            return res.status(200).send({ status: 1, message: "Data found", totalCount: totalCount || 0, data: data || [] })
        }
        return res.status(404).send({ status: 0, message: "Empty set", totalCount: 0, data: [] })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}

exports.getAllBlogForAdmin = async (req, res, next) => {
    try {
        const { userId, search, status, limit = 10, page = 1, blogCategoryId } = req.body
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

        if (["Published", "Draft"].includes(status)) {
            query = {
                ...query,
                isDeleted: false,
                status: status
            }
        }

        const totalCount = await Blogs.countDocuments({});

        let numberLimit = Number(limit) || 10;
        let numberSkip = (Number(page) - 1) * Number(limit) || 0;

        const data = await Blogs.aggregate([
            {
                $match: {
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

        if (data.length > 0) {
            return res.status(200).send({ status: 1, message: "Data found", totalCount: totalCount || 0, data: data || [] })
        }
        return res.status(404).send({ status: 0, message: "Empty set", totalCount: 0, data: [] })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}
