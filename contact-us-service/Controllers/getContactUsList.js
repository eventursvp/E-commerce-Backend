const mongoose = require("mongoose")
const ContactUs = require("model-hook/Model/contactUsModel")
const { constants } = require("model-hook/common_function/constants")

exports.getContactUsList = async (req, res, next) => {
    try {
        const { userId, search, limit = 10, page = 1 } = req.body
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
            if (!/^[a-zA-Z0-9@. ]*$/.test(search)) {
                return res.status(400).send({ status: 0, message: "Invalid search input" });
            }
            query = {
                $or: [
                    { firstName: { $regex: new RegExp(search, "i"), }, },
                    { lastName: { $regex: new RegExp(search, "i"), }, },
                    { email: { $regex: new RegExp(search, "i"), }, },
                    { phoneNo: { $regex: new RegExp(search, "i"), }, },
                    { message: { $regex: new RegExp(search, "i"), }, },
                ],
            };
        }

        const totalCount = await ContactUs.countDocuments({});

        let numberLimit = Number(limit) || 10;
        let numberSkip = (Number(page) - 1) * Number(limit) || 0;

        const data = await ContactUs.aggregate([
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
