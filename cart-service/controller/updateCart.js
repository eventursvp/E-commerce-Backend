const Cart = require("model-hook/Model/cartModel");
const User = require("model-hook/Model/userModel");
const Product = require("model-hook/Model/productModel");

const mongoose = require("mongoose");

exports.updateCart = async (req, res) => {
    try {
        const { cartId, quantity, addedBy } = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "User" )) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if (!(cartId && quantity && addedBy)) {
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

        if(quantity <= 0 || quantity === "undefined" ){
          return res.status(403).send({status:0,message:"Please add 1 or more quentity",data:[]})
        }

        const data = await Cart.findByIdAndUpdate(
            { _id: cartId, addedBy: addedBy },
            { $set: { quantity: quantity } },
            { new: true }
        );

        if (!data) {
            return res.status(404).send({ status: 0, message: "Record not found" });
        }

        return res.status(201).send({
            status: 1,
            message: "Record fetched successfull!",
            data: data,
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
