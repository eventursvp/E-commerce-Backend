// const mongoose = require("mongoose")
// const BlogComments = require("model-hook/Model/blogCommentsModel")

// exports.getOneComment = async (req, res, next) => {
//     try {
//         const { userId, commentId } = req.body
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
//         if (!commentId) {
//             return res.status(400).send({ status: 0, message: "comment id is required." })
//         }
//         if (!mongoose.isValidObjectId(commentId)) {
//             return res.status(400).send({ status: 0, message: "Invalid comment id." })
//         }
//         const checkComment = await BlogComments.findOne({ _id: commentId }).populate({
//             path: 'userId',
//             select: 'firstName lastName'
//         });

//         if (checkComment) {
//             return res.status(200).send({ status: 1, message: "Comment find", data: checkComment })
//         }
//         return res.status(404).send({ status: 0, message: "Comment not found with given id" })

//     } catch (error) {
//         console.log('error =>', error);
//         return res.status(500).send({ status: 0, message: "Something went wrong", error });
//     }
// }

const mongoose = require("mongoose")
const BlogComments = require("model-hook/Model/blogCommentsModel")

exports.getChildComment = async (req, res, next) => {
    try {
        const { userId, commentId } = req.body
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
        if (!commentId) {
            return res.status(400).send({ status: 0, message: "comment id is required." })
        }
        if (!mongoose.isValidObjectId(commentId)) {
            return res.status(400).send({ status: 0, message: "Invalid comment id." })
        }

        // const checkComment = await BlogComments.aggregate([
        //     { $match: { _id: new mongoose.Types.ObjectId(commentId) } },
        //     {
        //         $lookup: {
        //             from: 'User',
        //             localField: 'userId',
        //             foreignField: '_id',
        //             as: 'user'
        //         }
        //     },
        //     { $unwind: '$user' },
        //     {
        //         $lookup: {
        //             from: "BlogComments",
        //             localField: "childBlogCommentId",
        //             foreignField: "_id",
        //             as: "childComment"
        //         }
        //     },
        //     {
        //         $addFields: {
        //             childCommentCount: { $size: "$childBlogCommentId" },
        //         }
        //     },
        //     {
        //         $addFields: {
        //             commentLikesCount: { $size: "$likesUser" }
        //         },
        //     },
        //     {
        //         $project: {
        //             _id: 1,
        //             blogId: 1,
        //             userId: 1,
        //             comment: 1,
        //             likesUser: 1,
        //             user: {
        //                 firstName: 1,
        //                 lastName: 1
        //             },
        //             childBlogCommentId: 1,
        //             childComment: 1
        //         }
        //     },
        // ]);

        const checkComment = await BlogComments.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(commentId) } },
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
                $lookup: {
                    from: 'BlogComments',
                    localField: 'childBlogCommentId',
                    foreignField: '_id',
                    as: 'childComments'
                }
            },
            {
                $unwind: {
                    path: '$childComments',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'childComments.userId',
                    foreignField: '_id',
                    as: 'childComments.user'
                }
            },
            {
                $unwind: {
                    path: '$childComments.user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$_id',
                    // blogId: { $first: '$blogId' },
                    // userId: { $first: '$userId' },
                    comment: { $first: '$comment' },
                    likesUser: { $first: '$likesUser' },
                    user: { $first: '$user' },
                    childComments: {
                        $push: {
                            _id: '$childComments._id',
                            // blogId: '$childComments.blogId',
                            // userId: '$childComments.userId',
                            comment: '$childComments.comment',
                            likesUser: '$childComments.likesUser',
                            childBlogCommentId: '$childComments.childBlogCommentId',
                            createdAt: '$childComments.createdAt',
                            user: {
                                firstName: '$childComments.user.firstName',
                                lastName: '$childComments.user.lastName'
                            },
                            childCommentCount: { $size: '$childComments.childBlogCommentId' },
                            commentLikesCount: { $size: '$childComments.likesUser' }
                        }
                    },
                    childCommentCount: { $first: { $size: '$childBlogCommentId' } },
                    commentLikesCount: { $first: { $size: '$likesUser' } }
                }
            },
            {
                $project: {
                    _id: 1,
                    // blogId: 1,
                    // userId: 1,
                    comment: 1,
                    likesUser: 1,
                    user: {
                        firstName: 1,
                        lastName: 1
                    },
                    childComments: {
                        _id: 1,
                        // blogId: 1,
                        // userId: 1,
                        comment: 1,
                        // likesUser: 1,
                        // childBlogCommentId: 1,
                        createdAt: 1,
                        // updatedAt: 1,
                        user: 1,
                        childCommentCount: 1,
                        commentLikesCount: 1
                    },
                    childCommentCount: 1,
                    commentLikesCount: 1
                }
            }
        ]);


        if (checkComment && checkComment?.length > 0) {
            return res.status(200).send({ status: 1, message: "Comment find", data: checkComment[0] })
        }
        return res.status(404).send({ status: 0, message: "Comment not found with given id" })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}