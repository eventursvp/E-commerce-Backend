const Cart = require("model-hook/Model/cartModel");
const User = require("model-hook/Model/userModel");
const Product = require("model-hook/Model/productModel");

const mongoose = require("mongoose");

exports.addToCart = async (req, res) => {
    try {
        const { addedBy, productId, variantId } = req.body;

        // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }
        // if (loginUser?.data?.role != 'User') {
        //     return res.status(401).send({status:0,message:"Unauthorized access."})
        // }

        if (
            !(
                mongoose.Types.ObjectId.isValid(productId) &&
                mongoose.Types.ObjectId.isValid(addedBy) &&
                mongoose.Types.ObjectId.isValid(variantId)
            )
        ) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }

        if (!(addedBy && productId && variantId)) {
            return res.status(403).send({
                status: 0,
                message: "All fields are required",
                data: [],
            });
        }

        const alreadyExist = await Cart.findOne({
            addedBy: addedBy,
            productId: productId,
            variantId: variantId,
        });

        if (alreadyExist) {
            const data = await Cart.findOneAndUpdate(
                {
                    addedBy: addedBy,
                    productId: productId,
                    variantId: variantId,
                },
                { $inc: { quantity: +1 } },
                { new: true }
            );

            return res.status(200).send({status:0,message:"Record updated successfull",data:data})
        }
        const productData = await Product.findOne({
            _id: productId,
            isDeleted: false,
            isPublic: true,
        });

        if (!productData) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }

        const data = await new Cart(req.body).save();

        if (!data) {
            return res.status(403).send({
                status: 0,
                error: "Error in adding cart",
                data: [],
            });
        }

        return res.status(200).send({
            status: 1,
            message: "Record added successfully!",
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
