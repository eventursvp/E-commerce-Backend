const mongoose = require("mongoose")
const DeliveryAssignmentRequest = require("model-hook/Model/deliveryAssignmentRequestModel")
const CodCashReceived = require("model-hook/Model/codCashReceivedModel")
const DeliveryOtp = require("model-hook/Model/deliveryOtpModel")
const Orders = require("model-hook/Model/orderModel")
const { createApplicationLog } = require("model-hook/common_function/createLog")
const { compileAndSendEmail } = require("model-hook/common_function/mailSending")
const { constants } = require("model-hook/common_function/constants")

exports.verifyOrderOtp = async (req, res, next) => {
    try {
        const { deliveryBoyId, deliveryAssignmentRequestId, otp } = req.body
        const { loginUser } = req
        if (!deliveryBoyId) {
            return res.status(400).send({ status: 0, message: "Delivery boy id is required." })
        }
        if (!mongoose.isValidObjectId(deliveryBoyId)) {
            return res.status(400).send({ status: 0, message: "Invalid delivery boy id." })
        }
        if (loginUser?._id != deliveryBoyId || loginUser?.role !== "DeliveryBoy") {
            return res.status(403).send({ status: 0, message: "Unauthorized access." })
        }

        if (!deliveryAssignmentRequestId) {
            return res.status(400).send({ status: 0, message: "Delivery assignment id is required." })
        }
        if (!mongoose.isValidObjectId(deliveryAssignmentRequestId)) {
            return res.status(400).send({ status: 0, message: "Invalid delivery assignment request id." })
        }

        const checkDeliveryAssignment = await DeliveryAssignmentRequest.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(deliveryAssignmentRequestId),
                    deliveryBoyId: new mongoose.Types.ObjectId(deliveryBoyId),
                    status: "ACCEPTED"
                }
            },
            {
                $lookup: {
                    from: "Orders",
                    localField: "orderId",
                    foreignField: "_id",
                    as: "orderDetails"
                }
            },
            {
                $unwind: {
                    path: "$orderDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "User",
                    foreignField: "_id",
                    localField: "orderDetails.addedBy",
                    as: "customerData"
                }
            },
            {
                $unwind: {
                    path: "$customerData",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]).exec()

        const deliveryAssignmentData = checkDeliveryAssignment[0]
        if (!deliveryAssignmentData) {
            return res.status(404).send({ status: 0, message: "Delivery assignment requested data not found with given id." })
        }

        if (!otp) {
            return res.status(400).send({ status: 0, message: "Otp is required." })
        }

        if (otp.length !== 4 || !constants?.numberRegex.test(otp)) {
            return res.status(400).send({ status: 0, message: "Invalid Otp." })
        }

        if (deliveryAssignmentData?.orderDetails?.orderStatus === "DELIVERED") {
            return res.status(400).send({ status: 0, message: "Order is already delivered" })
        }

        if (deliveryAssignmentData?.orderDetails?.paymentMode === "COD") {
            const checkPayment = await CodCashReceived.findOne({
                orderId: deliveryAssignmentData?.orderDetails?._id,
                customerId: deliveryAssignmentData?.orderDetails?.addedBy,
                deliveryBoyId: loginUser?._id
            }).lean()
            if (!checkPayment) {
                return res.status(404).send({ status: 0, message: "Otp verify after payment received" })
            }
        }
        if (deliveryAssignmentData?.orderDetails?.paymentMode === "ONLINE") {
            // online payment checking
        }

        const otpData = await DeliveryOtp.findOne({ deliveryAssignmentRequestId: deliveryAssignmentRequestId, deliveryBoyId: deliveryBoyId }).lean();
        const currentDate = new Date()

        if (!otpData || otpData?.expirationTime < currentDate) {
            return res.status(400).send({ status: 0, message: "Otp is expired." })
        }

        if (otpData?.otp === otp) {
            const changeOrder = await Orders.findOneAndUpdate({ _id: deliveryAssignmentData?.orderDetails?._id }, { orderStatus: "DELIVERED" }, { new: true });
            if (changeOrder?.orderStatus === "DELIVERED") {
                await createApplicationLog("Delivery", "verify delivery otp", {}, {}, loginUser?._id)
                return res.status(200).send({ status: 1, message: "Otp is verified successful.", data: changeOrder })
            }
            return res.status(400).send({ status: 0, message: "Otp not verified, Please try again." })
        } else {
            return res.status(400).send({ status: 0, message: "Invalid Otp." })
        }

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}


exports.sendOtp = async (receiver, firstName, lastName, otp) => {
    const templateName = "sendOtp"
    const content = {
        fullName: `${firstName} ${lastName}`,
        otp: otp
    }
    const subject = 'Order Otp'
    compileAndSendEmail(templateName, receiver, content, subject)

}