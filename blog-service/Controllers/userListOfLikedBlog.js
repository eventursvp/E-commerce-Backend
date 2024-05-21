const mongoose = require("mongoose")
const Blogs = require("model-hook/Model/blogModel")
const BlogLikes = require("model-hook/Model/blogLikesModel")

exports.userListOfLikedBlog = async (req, res, next) => {
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
        const checkBlog = await Blogs.findOne({ _id: blogId, isDeleted: false, status: "Published" })
        if (!checkBlog) {
            return res.status(404).send({ status: 0, message: "Blog not found with given id." })
        }

        const data = await BlogLikes.aggregate([
            {
                $match: {
                    blogId: new mongoose.Types.ObjectId(blogId)
                }
            },
            {
                $lookup: {
                    from: "Blogs",
                    foreignField: "_id",
                    localField: "blogId",
                    as: "blogData"
                }
            },
            {
                $unwind: {
                    path: "$blogData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "User",
                    foreignField: "_id",
                    localField: "userId",
                    as: "userData"
                }
            },
            {
                $unwind: {
                    path: "$userData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: "$blogData._id",
                    blogData: { $first: "$blogData" },
                    userData: {
                        $addToSet: {
                            _id: "$userData._id",
                            firstName: "$userData.firstName",
                            lastName: "$userData.lastName"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    blogData: 1,
                    userData: 1
                }
            },
        ])
        if (data && data.length > 0) {
            data[0].userData.sort((a, b) => {
                if (a.firstName !== b.firstName) {
                    return a.firstName.localeCompare(b.firstName);
                } else if (a.lastName !== b.lastName) {
                    return a.lastName.localeCompare(b.lastName)
                } else {
                    return a._id.toString().localeCompare(b._id).toString()
                }
            });
            return res.status(200).send({ status: 1, message: "Data found", data: data })
        }
        return res.status(404).send({ status: 0, message: "Empty set", data: [] })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}