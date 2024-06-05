const mongoose = require("mongoose")
const DeliveryAssignmentRequest = require("model-hook/Model/deliveryAssignmentRequestModel")
const DeliveryBoy = require("model-hook/Model/deliveryBoyModel")
const GaveChangeToDeliveryBoy = require("model-hook/Model/gaveChangeToDeliveryBoyModel")
const { createApplicationLog } = require("model-hook/common_function/createLog")
const { constants } = require("model-hook/common_function/constants")

exports.giveChangeToDeliveryBoy = async (req, res, next) => {
    try {
        const { userId, deliveryBoyId, coinsAndNotes, amountGiven, notes, } = req.body
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

        if (!deliveryBoyId) {
            return res.status(400).send({ status: 0, message: "Delivery boy id is required." })
        }
        if (!mongoose.isValidObjectId(deliveryBoyId)) {
            return res.status(400).send({ status: 0, message: "Invalid delivery boy id." })
        }
        const checkDeliveryBoy = await DeliveryBoy.findOne({ _id: deliveryBoyId, emailVerified: true })
        if (!checkDeliveryBoy) {
            return res.status(404).send({ status: 0, message: "Delivery boy data not found with given id." })
        }

        if (notes && !constants.searchPattern.test(notes)) {
            return res.status(400).send({ status: 0, message: "Invalid notes value." })
        }
        if (notes && notes.length > 100) {
            return res.status(400).send({ status: 0, message: "Maximum 100 character allow into notes." })
        }

        if (!coinsAndNotes || coinsAndNotes?.length === 0) {
            return res.status(400).send({ status: 0, message: "Coin and Notes field is required." })
        }

        if (!Array.isArray(coinsAndNotes)) {
            return res.status(400).send({ status: 0, message: "Coin and notes field must be an array." })
        }

        const currencyList = [1, 2, 5, 10, 20, 50, 100, 200, 500]
        for (let item of coinsAndNotes) {
            if (!item?.type) {
                return res.status(400).send({ status: 0, message: "Type is required into coin and notes." })
            }
            if (item.type <= 0 || typeof item.type !== "number" || !currencyList.includes(item?.type)) {
                return res.status(400).send({ status: 0, message: "Invalid value of type into coin and notes." })
            }
            if (!item?.quantity) {
                return res.status(400).send({ status: 0, message: "Quantity is required into coin and notes." })
            }
            if (item.quantity <= 0 || typeof item.quantity !== "number") {
                return res.status(400).send({ status: 0, message: "Invalid value of quantity into coin and notes." })
            }
        }
        const initialValue = 0;
        const totalOfCoinsAndNotes = coinsAndNotes.reduce((accumulator, currentValue) => {
            return accumulator + (currentValue.type * currentValue.quantity);
        }, initialValue);

        if (!totalOfCoinsAndNotes) {
            return res.status(400).send({ status: 0, message: "Invalid coin and notes value." })
        }

        if (!amountGiven) {
            return res.status(400).send({ status: 0, message: "Amount given field is required." })
        }
        if (!constants.numberRegex.test(amountGiven) || amountGiven <= 0 || typeof amountGiven !== "number" || amountGiven !== totalOfCoinsAndNotes) {
            return res.status(400).send({ status: 0, message: "Invalid value of amount given." })
        }
        const checkPreviousNotReturn = await GaveChangeToDeliveryBoy.findOne({ deliveryBoyId: deliveryBoyId, status: "GIVEN" }).select("status").lean()
        if (checkPreviousNotReturn) {
            return res.status(400).send({ status: 0, message: "First collect previous given change." })
        }

        const result = await GaveChangeToDeliveryBoy.create({
            deliveryBoyId,
            amountGiven,
            coinsAndNotes,
            status: "GIVEN",
            notes: notes || "",
            userId
        });

        if (result) {
            await createApplicationLog("Delivery", "give change to delivery boy", {}, {}, loginUser?._id)
            return res.status(201).send({ status: 1, message: "Change money given to delivery boy. Entry created successfully.", data: result });
        } else {
            return res.status(500).send({ status: 0, message: "Failed to create entry for change money given to delivery boy. Please try again." });
        }
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}