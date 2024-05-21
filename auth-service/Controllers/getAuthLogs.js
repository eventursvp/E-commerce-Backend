const mongoose = require('mongoose')
const ApplicationLog = require("model-hook/Model/applicationLogsModel")

exports.getAuthLogs = async (req, res, next) => {
    try {
        const { userId } = req.body
        const { loginUser } = req
        if (!userId) {
            return res.status(400).send({ status: 0, message: "User Id is required." })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: 0, message: "Invalid user id." })
        }
        if (loginUser?._id != userId || loginUser.role != 'Admin') {
            return res.status(403).send({ status: 0, message: "Unauthorized access." })
        }
        const data = await ApplicationLog.aggregate([
            {
                $match: {
                    module: "Auth"
                }
            },
            {
                $lookup: {
                    from: "User",
                    localField: "userId",
                    foreignField: "_id",
                    as: "User"
                }
            },
            {
                $unwind: {
                    path: "$User",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    module: 1,
                    activityName: 1,
                    preValue: 1,
                    nextValue: 1,
                    userId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "User._id": 1,
                    "User.firstName": 1,
                    "User.lastName": 1,
                    "User.email": 1,
                    
                }
            }
        ])
        if (data.length === 0) {
            return res.status(404).send({ status: 0, message: "Empty set." })
        }
        return res.status(200).send({ status: 1, message: "Data founded", data: data })
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}