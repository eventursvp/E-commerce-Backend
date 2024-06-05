const mongoose = require("mongoose")
const DeliveryBoy = require("model-hook/Model/deliveryBoyModel")
const DeliveryBoyFeedback = require("model-hook/Model/deliveryBoyFeedback");
const { constants } = require("model-hook/common_function/constants")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.getAllFeedbackOfDeliveryBoy = async (req, res, next) => {
    try {
        const { userId, deliveryBoyId, rating, page = 1, limit = 10 } = req.body;
        const { loginUser } = req

        if (!constants.numberRegex.test(limit) || limit <= 0) {
            return res.status(400).send({ status: 0, message: "Invalid limit value" })
        }
        if (!constants.numberRegex.test(page) || page <= 0) {
            return res.status(400).send({ status: 0, message: "Invalid page value" })
        }

        if (!userId) {
            return res.status(400).send({ status: 0, message: "User id is required." })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: 0, message: "Invalid user id." })
        }
        if (loginUser?._id != userId || loginUser.role != 'Admin') {
            return res.status(403).send({ status: 0, message: "Unauthorized access." })
        }

        if (!deliveryBoyId) {
            return res.status(400).send({ status: 0, message: "Delivery boy id is required." })
        }
        if (!mongoose.isValidObjectId(deliveryBoyId)) {
            return res.status(400).send({ status: 0, message: "Invalid delivery boy id." })
        }
        const checkDeliveryBoy = await DeliveryBoy.findOne({ _id: deliveryBoyId, emailVerified: true }).lean()
        if (!checkDeliveryBoy) {
            return res.status(404).send({ status: 0, message: "Delivery boy not found with given id" })
        }

        let queryObj = {}
        if (rating) {
            if (![1, 2, 3, 4, 5].includes(rating) || typeof (rating) !== 'number') {
                return res.status(400).send({ status: 0, message: "Invalid Rating value." })
            }
            queryObj = {
                ...queryObj,
                rating: rating
            }
        }

        let numberLimit = Number(limit) || 10;
        let numberSkip = (Number(page) - 1) * Number(limit) || 0;

        const allFeedback = await DeliveryBoyFeedback.aggregate([
            {
                $match: {
                    deliveryBoyId: new mongoose.Types.ObjectId(deliveryBoyId),
                    ...queryObj
                }
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: {
                    path: '$userDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $skip: numberSkip
            },
            {
                $limit: numberLimit
            },
            {
                $group: {
                    _id: '$deliveryBoyId',
                    deliveryBoyId: { $first: '$deliveryBoyId' },
                    feedbacks: {
                        $push: {
                            _id: '$_id',
                            rating: '$rating',
                            comment: '$comment',
                            user: {
                                _id: '$userDetails._id',
                                firstName: '$userDetails.firstName',
                                lastName: '$userDetails.lastName',
                                email: '$userDetails.email'
                            }
                        }
                    },
                }
            },
            {
                $lookup: {
                    from: 'DeliveryBoy',
                    localField: 'deliveryBoyId',
                    foreignField: '_id',
                    as: 'deliveryBoyDetails'
                }
            },
            {
                $unwind: {
                    path: '$deliveryBoyDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    deliveryBoyId: {
                        _id: '$deliveryBoyDetails._id',
                        firstName: '$deliveryBoyDetails.firstName',
                        lastName: '$deliveryBoyDetails.lastName',
                        email: '$deliveryBoyDetails.email'
                    },
                    feedbacks: 1,
                }
            },
        ]);
        if (allFeedback && allFeedback.length > 0) {
            await createApplicationLog("Delivery", "get all feedback of delivery boy", {}, {}, loginUser?._id)
            return res.status(201).send({ status: 1, message: "Feedback get successful", data: allFeedback })
        } else {
            return res.status(404).send({ status: 0, message: "Empty set.", data: [] })
        }

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}