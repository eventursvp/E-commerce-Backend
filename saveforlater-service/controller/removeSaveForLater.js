const SaveForLater = require("model-hook/Model/saveforlaterModel");
const Product = require("model-hook/Model/productModel");
const Cart = require("model-hook/Model/cartModel");
const mongoose = require("mongoose");
const { createApplicationLog } = require("model-hook/common_function/createLog");

exports.removeSaveForLater = async (req, res) => {
    try {
        const { addedBy, saveForLaterId } = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "User")) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if (
            !(
                mongoose.Types.ObjectId.isValid(saveForLaterId) &&
                mongoose.Types.ObjectId.isValid(addedBy)
            )
        ) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }

        if (!(addedBy && saveForLaterId)) {
            return res.status(403).send({
                status: 0,
                message: "All fields are required",
                data: [],
            });
        }

        const data = await SaveForLater.findOneAndUpdate(
            { _id: saveForLaterId, isDeleted: false, addedBy: addedBy },
            { $set: { isDeleted: true } },
            { new: true }
        );

        if (!data) {
            return res.status(403).send({
                status: 0,
                error: "Record not found",
                data: [],
            });
        }

        await createApplicationLog("SaveForLater", "remove save for later", {}, {}, addedBy);


        return res.status(200).send({
            status: 1,
            message: "Record deleted successfully!"
        });
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });
    }
};
