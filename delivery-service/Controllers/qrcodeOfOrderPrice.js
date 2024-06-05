const mongoose = require("mongoose")
const QRCode = require('qrcode');
const DeliveryAssignmentRequest = require("model-hook/Model/deliveryAssignmentRequestModel")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.qrcodeOfOrderPrice = async (req, res, next) => {
    try {
        const { deliveryAssignmentRequestId, deliveryBoyId } = req.body
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

        const deliveryAssignmentData = await DeliveryAssignmentRequest.findOne({ _id: deliveryAssignmentRequestId, deliveryBoyId: deliveryBoyId, status: "ACCEPTED" }).populate("orderId")
        if (!deliveryAssignmentData) {
            return res.status(404).send({ status: 0, message: "Delivery assignment requested data not found with given id." })
        }
        const price = deliveryAssignmentData?.orderId?.price
        if (!price || typeof price != "number") {
            return res.status(400).send({ status: 0, message: "Price not detect, Please contact admin." })
        }
        const data = {
            price: price,
            paymentMode: deliveryAssignmentData?.orderId?.paymentMode
        };

        const jsonString = JSON.stringify(data);
        const qrCodeBuffer = await QRCode.toBuffer(jsonString, { width: 400 });

        if (qrCodeBuffer) {
            await createApplicationLog("Delivery", "generate qr code ", {}, {}, loginUser)
            // Send the buffer as response with appropriate content type
            res.set({ 'Content-Type': 'image/png' });
            return res.status(200).send(qrCodeBuffer);
        }
        return res.status(500).send({ status: 0, message: "Qr code not generated, Please try again." })
    } catch {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}