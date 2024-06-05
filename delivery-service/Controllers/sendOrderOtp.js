const mongoose = require("mongoose")
const otpGenerator = require("otp-generator");
const DeliveryAssignmentRequest = require("model-hook/Model/deliveryAssignmentRequestModel")
const CodCashReceived = require("model-hook/Model/codCashReceivedModel")
const DeliveryOtp = require("model-hook/Model/deliveryOtpModel")
const { createApplicationLog } = require("model-hook/common_function/createLog")
const { compileAndSendEmail } = require("model-hook/common_function/mailSending")

function generateOtp() {
    const otp = parseInt(otpGenerator.generate(4, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false }));
    return otp;
}

exports.sendOrderOtp = async (req, res, next) => {
    try {
        const { deliveryBoyId, deliveryAssignmentRequestId } = req.body
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
        ]);
        const deliveryAssignmentData = checkDeliveryAssignment[0]
        if (!deliveryAssignmentData) {
            return res.status(404).send({ status: 0, message: "Delivery assignment requested data not found with given id." })
        }

        if (deliveryAssignmentData?.orderDetails?.paymentMode === "COD") {
            const checkPayment = await CodCashReceived.findOne({
                orderId: deliveryAssignmentData?.orderDetails?._id,
                customerId: deliveryAssignmentData?.orderDetails?.addedBy,
                deliveryBoyId: loginUser?._id
            })
            if (!checkPayment) {
                return res.status(404).send({ status: 0, message: "Otp send after payment received" })
            }
        }
        if (deliveryAssignmentData?.orderDetails?.paymentMode === "ONLINE") {
            // online payment checking
        }

        const otp = await generateOtp();

        const findAlreadySendOtp = await DeliveryOtp.findOne({
            deliveryAssignmentRequestId: deliveryAssignmentRequestId,
            deliveryBoyId: deliveryBoyId
        })

        if (!findAlreadySendOtp) {
            const sendOtp = await DeliveryOtp.create({
                deliveryAssignmentRequestId: deliveryAssignmentRequestId,
                deliveryBoyId: deliveryBoyId,
                otp: otp,
                expirationTime: new Date(Date.now() + 30 * 60 * 1000)
            })
            if (!sendOtp) {
                return res.status(500).send({ status: 0, message: "Otp not send, Please try again." })
            }
            await createApplicationLog("Delivery", "send delivery otp", {}, {}, loginUser?._id)
            await this.sendOtp(deliveryAssignmentData?.customerData?.email, deliveryAssignmentData?.customerData?.firstName, deliveryAssignmentData?.customerData?.lastName, otp)
            return res.status(201).send({ status: 1, message: "Otp send successfully." })
        }
        else {
            const updateOtp = await DeliveryOtp.findOneAndUpdate(
                {
                    deliveryAssignmentRequestId: deliveryAssignmentRequestId,
                    deliveryBoyId: deliveryBoyId,
                },
                {
                    otp: otp,
                    expirationTime: new Date(Date.now() + 30 * 60 * 1000)
                },
                {
                    new: true
                }
            )
            if (!updateOtp) {
                return res.status(500).send({ status: 0, message: "Otp not send, Please try again." })
            }
            await createApplicationLog("Delivery", "send delivery otp", {}, {}, loginUser?._id)
            await this.sendOtp(deliveryAssignmentData?.customerData?.email, deliveryAssignmentData?.customerData?.firstName, deliveryAssignmentData?.customerData?.lastName, otp)
            return res.status(201).send({ status: 1, message: "Otp send successfully" })
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