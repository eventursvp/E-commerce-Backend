const Wishlist = require("model-hook/Model/wishlistModel");
const User = require("model-hook/Model/userModel");
const Product = require("model-hook/Model/productModel");
const WishlistCollection = require("model-hook/Model/wishlistCollectionModel");
const mongoose = require("mongoose");

exports.createCollection = async (req, res) => {
    try {
        const { addedBy, name } = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "User")) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if (!mongoose.Types.ObjectId.isValid(addedBy) && name) {
            return res
                .status(403)
                .send({ status: 0, message: "Invalid request", data: [] });
        }

        const alreadyExist = await WishlistCollection.findOne({
            name: name,
            addedBy: addedBy,
        });

        if (alreadyExist) {
            return res
                .status(409)
                .send({ status: 0, message: "Record already exist", data: [] });
        }

        const collectionData = {
            name: name,
            addedBy: addedBy,
        };
        const data = await new WishlistCollection(collectionData).save();

        if (!data) {
            return res.status(403).send({
                status: 0,
                error: "Error in adding cart",
                data: [],
            });
        }

        return res.status(201).send({
            status: 1,
            message: "Record Added Successfully!",
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

exports.addToCollection = async (req, res) => {
    try {
        const { addedBy, collectionId, productId,variantId } = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "User")) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if (
            !(
                mongoose.Types.ObjectId.isValid(addedBy) &&
                mongoose.Types.ObjectId.isValid(collectionId) &&
                mongoose.Types.ObjectId.isValid(productId) &&
                mongoose.Types.ObjectId.isValid(variantId) 
            )
        ) {
            return res
                .status(403)
                .send({ status: 0, message: "Invalid request", data: [] });
        }

        const productData = await Product.findOne({
            _id: productId,
            isDeleted: false,
            isPublic: true,
            'variants._id': new mongoose.Types.ObjectId(variantId)
        });

        if (!productData) {
            return res
                .status(404)
                .send({ status: 0, message: "Record not found 1", data: [] });
        }

        const variant = productData.variants.find(v => v._id.toString() === variantId);

if (!variant) {
    return res.status(404).send({ status: 0, message: "Variant not found", data: [] });
}

        const wishlistCollectionData = await WishlistCollection.findOne({
            _id: collectionId,
            addedBy: addedBy,
        });
        // console.log("wishlistCollectionData", wishlistCollectionData);

        if (!wishlistCollectionData) {
            return res
                .status(409)
                .send({ status: 0, message: "Record not found 2", data: [] });
        }

        console.log("Price==>",variant.price);
        const data = await WishlistCollection.findByIdAndUpdate(
            collectionId,
            { $push: { items: { productId,variantId,productData,price:variant.price } } },
            { new: true }
        );

        // console.log("data:==>", data);
        if (!data) {
            return res.status(403).send({
                status: 0,
                error: "Error in adding cart",
                data: [],
            });
        }

        return res.status(201).send({
            status: 1,
            message: "Record Added Successfully!",
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
