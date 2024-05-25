const Cart = require("model-hook/Model/cartModel");
const User = require("model-hook/Model/userModel");
const Product = require("model-hook/Model/productModel");

const mongoose = require("mongoose");

exports.removeCart = async (req, res) => {
    try {
        const { cartId, addedBy } = req.body;

        // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }
        // if (loginUser?.data?.role != 'User') {
        //     return res.status(401).send({status:0,message:"Unauthorized access."})
        // }

        if (!(cartId && addedBy)) {
            return res.status(403).send({
                status: 0,
                message: "All fields are required",
                data: [],
            });
        }

        if (
            !(
                mongoose.Types.ObjectId.isValid(cartId) &&
                mongoose.Types.ObjectId.isValid(addedBy)
            )
        ) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }

        const data = await Cart.findByIdAndUpdate(
            {
                _id: cartId,
                addedBy: addedBy,
            },
            { $set: { isDeleted: true } },
            { new: true }
        );

        if (!data) {
            return res.status(403).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }
        return res
            .status(200)
            .send({ status: 1, message: "Record deleted successfully!" });
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });
    }
};
