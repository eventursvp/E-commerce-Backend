const Wishlist = require("model-hook/Model/wishlistModel");
const User = require("model-hook/Model/userModel");
const Product = require("model-hook/Model/productModel");

const mongoose = require("mongoose");

exports.addtoWishlist = async (req, res) => {
    try {
        const { productId, addedBy } = req.body;

        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "User")) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if (
            !(
                mongoose.Types.ObjectId.isValid(productId) &&
                mongoose.Types.ObjectId.isValid(addedBy)
            )
        ) {
            return res
                .status(400)
                .send({ status: 0, message: "Invalid request", data: [] });
        }

        const productData = await Product.findOne({
            _id: productId,
            isDeleted: false,
            isPublic: true,
        });

        if (!productData) {
            return res
                .status(404)
                .send({ status: 0, message: "Record not found", data: [] });
        }

        // Check if the wishlist exists for the user, if not, create one
        let wishlist = await Wishlist.findOne({ addedBy });
        if (!wishlist) {
            wishlist = new Wishlist({ addedBy });
            await wishlist.save();
        }

        // Check if the product is already in the wishlist
        if (wishlist.items.includes(productId)) {
            return res
                .status(400)
                .send({
                    status: 0,
                    message: "Product already exists in the wishlist",
                    data: [],
                });
        }

        // Add the product to the wishlist
        wishlist.items.push(productId);
        await wishlist.save();

        return res.status(200).send({
            status: 1,
            message: "Product added to wishlist successfully",
            data: wishlist,
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
