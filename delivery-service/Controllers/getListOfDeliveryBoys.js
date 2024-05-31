const mongoose = require("mongoose")
const DeliveryBoy = require("model-hook/Model/deliveryBoyModel")
const { constants } = require("model-hook/common_function/constants")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.getListOfDeliveryBoys = async (req, res, next) => {
    try {
        const { userId, status, gender, search, page = 1, limit = 10 } = req.body
        const { loginUser } = req
        if (!userId) {
            return res.status(400).send({ status: 0, message: "User id is required." })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: 0, message: "Invalid user id." })
        }
        if (loginUser?._id != userId || loginUser.role != 'Admin') {
            return res.status(403).send({ status: 0, message: "Unauthorized access." })
        }
        let filterObj = {}

        if (search) {
            // const searchParts = search.split(" ");
            // const regexPattern = searchParts.map(part => `(${part})`).join("|");
            // const searchRegex = new RegExp(regexPattern, "i");
            // if (!constants.searchPattern.test(search)) {
            //     return res.status(400).send({ status: 0, message: "Invalid search input" });
            // }
            // filterObj = {
            //     ...filterObj,
            //     $or: [
            //         { firstName: { $regex: searchRegex } },
            //         { lastName: { $regex: searchRegex } },
            //         { email: { $regex: searchRegex } },
            //     ],
            // };
            if (!constants.searchPattern.test(search)) {
                return res.status(400).send({ status: 0, message: "Invalid search input" });
            }
            filterObj = {
                ...filterObj,
                $or: [
                    { firstName: { $regex: new RegExp(search, "i") } },
                    { lastName: { $regex: new RegExp(search, "i") } },
                    { email: { $regex: new RegExp(search, "i") } },
                    { "vehicleDetails.vehicleType": { $regex: new RegExp(search, "i") } },
                    { "vehicleDetails.vehicleNumber": { $regex: new RegExp(search, "i") } },
                    { "vehicleDetails.model": { $regex: new RegExp(search, "i") } },
                    { "vehicleDetails.owner": { $regex: new RegExp(search, "i") } }
                ],
            };

        }
        if (status) {
            if (!["Active", "Deactive"].includes(status)) {
                return res.status(400).send({ status: 0, message: "Invalid status value" })
            }
            if (status === "Active") {
                filterObj = {
                    ...filterObj,
                    isDeactive: false
                }
            } else if (status === "Deactive") {
                filterObj = {
                    ...filterObj,
                    isDeactive: true
                }
            }
        }
        if (gender) {
            if (!["Male", "Female", "Other"].includes(gender)) {
                return res.status(400).send({ status: 0, message: "Invalid gender." })
            }
            filterObj = {
                ...filterObj,
                gender: gender
            }
        }
        if (limit && (!constants.numberRegex.test(limit) || limit <= 0)) {
            return res.status(400).send({ status: 0, message: "Invalid limit value" })
        }
        if (page && (!constants.numberRegex.test(page) || page <= 0)) {
            return res.status(400).send({ status: 0, message: "Invalid page value" })
        }
        
        let numberLimit = Number(limit) || 10;
        let numberSkip = (Number(page) - 1) * Number(limit) || 0;
        const totalDeliveryBoyCount = await DeliveryBoy.countDocuments({
            isLoggedOut: false,
            emailVerified: true,
        })
        const deliveryBoyList = await DeliveryBoy.aggregate([
            {
                $lookup: {
                    from: 'VehicleDetails',
                    localField: 'vehicleDetails',
                    foreignField: '_id',
                    as: 'vehicleDetails'
                }
            },
            {
                $unwind: {
                    path: '$vehicleDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    isLoggedOut: false,
                    emailVerified: true,
                    ...filterObj
                }
            },
            {
                $group: {
                    _id: '$_id',
                    firstName: { $first: '$firstName' },
                    lastName: { $first: '$lastName' },
                    email: { $first: '$email' },
                    password: { $first: '$password' },
                    gender: { $first: '$gender' },
                    phoneNo: { $first: '$phoneNo' },
                    role: { $first: '$role' },
                    idCard: { $first: '$idCard' },
                    licence: { $first: '$licence' },
                    emailVerified: { $first: '$emailVerified' },
                    isLoggedOut: { $first: '$isLoggedOut' },
                    phoneVerified: { $first: '$phoneVerified' },
                    isDeactive: { $first: '$isDeactive' },
                    createdAt: { $first: '$createdAt' },
                    updatedAt: { $first: '$updatedAt' },
                    vehicleDetails: { $push: '$vehicleDetails' }
                }
            },
            {
                $sort: {
                    firstName: 1,
                    lastName: 1
                }
            },
            {
                $project: {
                    _id: 1,
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    gender: 1,
                    role: 1,
                    idCard: 1,
                    licence: 1,
                    isDeactive: 1,
                    vehicleDetails: 1
                }
            },
            {
                $skip: numberSkip
            },
            {
                $limit: numberLimit
            }
        ]);
        if (deliveryBoyList.length === 0 || !deliveryBoyList) {
            return res.status(404).send({ status: 0, message: "Empty set", data: [] })
        }
        await createApplicationLog("Delivery", "get delivery boys list", {}, {}, loginUser?._id)
        return res.status(200).send({ status: 1, message: "Delivery boys list found successfully.", totalCount: totalDeliveryBoyCount, data: deliveryBoyList, })
    } catch (error) {
        console.log(error);
        return res.send({ status: 0, message: "Something went wrong.", error });
    }
}