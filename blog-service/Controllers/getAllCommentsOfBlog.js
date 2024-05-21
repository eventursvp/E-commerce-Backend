// const mongoose = require("mongoose")
// const Blogs = require("model-hook/Model/blogModel")
// const BlogComments = require("model-hook/Model/blogCommentsModel")

// exports.getAllCommentsOfBlog = async (req, res, next) => {
//     try {
//         const { userId, blogId } = req.body
//         const { loginUser } = req
//         if (!userId) {
//             return res.status(400).send({ status: 0, message: "User Id is required." })
//         }
//         if (!mongoose.isValidObjectId(userId)) {
//             return res.status(400).send({ status: 0, message: "Invalid user id." });
//         }
//         if (loginUser?._id != userId || !["User", "Admin"].includes(loginUser?.role)) {
//             return res.status(403).send({ status: 0, message: "Unauthorized access." })
//         }
//         if (!blogId) {
//             return res.status(400).send({ status: 0, message: "Blog id is required." })
//         }
//         if (!mongoose.isValidObjectId(blogId)) {
//             return res.status(400).send({ status: 0, message: "Invalid blog id." })
//         }
//         const checkBlog = await Blogs.findOne({ _id: blogId, status: "Published", isDeleted: false })
//         if (!checkBlog) {
//             return res.status(404).send({ status: 0, message: "Blog not found with given id" })
//         }

//         const getAllCommentData = await BlogComments.find({ blogId: blogId }).populate({ path: "userId", select: "firstName lastName" })
//         if (getAllCommentData && getAllCommentData.length > 0) {
//             return res.status(200).send({ status: 1, message: "Data found", data: getAllCommentData })
//         }
//         return res.status(404).send({ status: 0, message: "Empty set.", data: [] })

//     } catch (error) {
//         console.log('error =>', error);
//         return res.status(500).send({ status: 0, message: "Something went wrong", error });
//     }
// }

const mongoose = require("mongoose")
const Blogs = require("model-hook/Model/blogModel")
const BlogComments = require("model-hook/Model/blogCommentsModel")

exports.getAllCommentsOfBlog = async (req, res, next) => {
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
        const checkBlog = await Blogs.findOne({ _id: blogId, status: "Published", isDeleted: false })
        if (!checkBlog) {
            return res.status(404).send({ status: 0, message: "Blog not found with given id" })
        }

        const getAllCommentData = await BlogComments.aggregate([
            { $match: { blogId: new mongoose.Types.ObjectId(blogId), type: "Parent" } },
            {
                $lookup: {
                    from: 'User',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    // blogId: 1,
                    // userId: 1,
                    comment: 1,
                    likesUser: 1,
                    user: {
                        firstName: 1,
                        lastName: 1
                    },
                    childBlogCommentId: 1,
                    createdAt: 1
                }
            },
            {
                $addFields: {
                    childCommentCount: { $size: "$childBlogCommentId" },
                }
            },
            {
                $addFields: {
                    commentLikesCount: { $size: "$likesUser" }
                },
            }
        ]);

        if (getAllCommentData && getAllCommentData.length > 0) {
            return res.status(200).send({ status: 1, message: "Data found", data: getAllCommentData })
        }
        return res.status(404).send({ status: 0, message: "Empty set.", data: [] })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}