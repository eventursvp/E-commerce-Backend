const SaveForLater = require("model-hook/Model/saveforlaterModel");
const Product = require("model-hook/Model/productModel");
const Cart = require("model-hook/Model/cartModel");
const Wishlist = require("model-hook/Model/wishlistModel");
const WishListCollection = require("model-hook/Model/wishlistCollectionModel");
const mongoose = require("mongoose");

exports.addToSaveForLater = async (req, res) => {
    try {
        const { addedBy, productId, variantId, cartId } = req.body;

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

        if (!(addedBy && productId && variantId && cartId)) {
            return res.status(403).send({
                status: 0,
                message: "All fields are required",
                data: [],
            });
        }

        const alreadyExist = await SaveForLater.findOne({
            addedBy: addedBy,
            productId: productId,
            variantId: variantId,
            cartId: cartId,
        });

        if (alreadyExist) {
            return res
                .status(409)
                .send({ status: 0, message: "Record already exist", data: [] });
        }

        const cartData = await Cart.findOne({
            _id: cartId,
            isDeleted: false,
            addedBy: addedBy,
            productId: productId,
            variantId: variantId,
        });

        if (!cartData) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }

        const saveForLaterData = {
            addedBy,
            cartId,
            productId,
            variantId,
        };
        const data = await new SaveForLater(saveForLaterData).save();

        if (!data) {
            return res.status(403).send({
                status: 0,
                error: "Error in adding saveforlater",
                data: [],
            });
        }

        await Cart.findOneAndUpdate(
            { _id: cartId, productId: productId, variantId: variantId },
            { $set: { isDeleted: true } },
            { new: true }
        );
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

exports.addToList = async (req, res) => {
    try {
        const { addedBy, productId, variantId, cartId, saveForLaterId } =
            req.body;

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
                mongoose.Types.ObjectId.isValid(variantId) &&
                mongoose.Types.ObjectId.isValid(saveForLaterId) &&
                mongoose.Types.ObjectId.isValid(cartId)

            )
        ) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }

        if (!(addedBy && productId && variantId && cartId && saveForLaterId)) {
            return res.status(403).send({
                status: 0,
                message: "All fields are required",
                data: [],
            });
        }

        const alreadyCart = await Cart.findOne({
            _id: cartId,
            addedBy: addedBy,
            productId: productId,
            variantId: variantId,
            isDeleted: true,
        });

        if (alreadyCart) {

            const data = await SaveForLater.findOneAndUpdate(
                {
                    _id: saveForLaterId,
                    addedBy: addedBy,
                    productId: productId,
                    variantId: variantId,
                    cartId:cartId,
                    isDeleted: false,
                },
                { $set: { isDeleted: true } },
                { new: true }
            );

            if (!data) {
                return res.status(404).send({ status: 0, message: "Record not found",data:[] });
            }

            await Cart.findOneAndUpdate(
                {
                    _id: cartId,
                    addedBy: addedBy,
                    productId: productId,
                    variantId: variantId,
                    isDeleted: true,
                },
                { $set: { isDeleted: false } },
                { new: true }
            );

            return res.status(200).send({
                status: 1,
                message: "Record deleted successfully!",
            });
        }else{
            return res.status(404).send({ status: 0, message: "Record already in list",data:[] });

        }

    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });
    }
};
