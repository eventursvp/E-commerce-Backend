const Order = require("model-hook/Model/orderModel");
const User = require("model-hook/Model/adminModel");
const Product = require("model-hook/Model/productModel");
const Cart = require("model-hook/Model/cartModel");
const mongoose = require('mongoose');
const orderid = require("order-id")("key");

exports.createOrder = async (req, res) => {
    try {
        const {
            productId,
            addedBy,
            paymentMode,
            cartId,
            addressId,
            quantity,
            price,
            variantId,
        } = req.body;

        if (
            !(
                mongoose.Types.ObjectId.isValid(productId) &&
                mongoose.Types.ObjectId.isValid(addedBy) &&
                mongoose.Types.ObjectId.isValid(addressId) &&
                mongoose.Types.ObjectId.isValid(variantId)
            )
        ) {
            return res.status(403).send({
                status: 0,
                message: "Invalid request",
                data: [],
            });
        }

        // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }

        const variantData = await Product.findOne({
            "variants._id": variantId,
            "variants.variantAvailable": "STOCK",
        });

        if (!variantData) {
            return res.status(404).send({
                status: 0,
                message: "Product not available",
                data: [],
            });
        }

        const productData = await Product.findOne({
            _id:productId,
            productAvailable:"STOCK"
        });

        if (!productData) {
            return res.status(404).send({
                status: 0,
                message: "Product not available",
                data: [],
            });
        }
        if(!variantData.variants.some(data => data.price === price)) {
            return res.status(403).send({status: 0, message: "Invalid Amount", data: []});
        }
        
        if (cartId) {
            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                return res.status(403).send({
                    status: 0,
                    message: "Invalid request",
                    data: [],
                });
            }
            const cartData = await Cart.findOne({
                _id: cartId,
                addedBy: addedBy,
            });

            if (!cartData) {
                return res.status(404).send({
                    status: 0,
                    message: "Record not found",
                    data: [],
                });
            }

            let obj = {
                addedBy: addedBy,
                orderNumber: orderid.generate(),
                paymentMode: paymentMode,
                cartId: cartId,
                addressId: addressId,
                productId: cartData.productId,
                price: cartData.price,
                quantity: cartData.quantity,
                variantId: cartData.variantId,
            };
            const order = await new Order(obj).save();
            if (!order) {
                return res.status(403).send({
                    status: 0,
                    message: "Order not create",
                    data: [],
                });
            }
            await Product.findOneAndUpdate(
                {
                    _id: cartData.productId,
                    productAvailable: "STOCK",
                    variants: {
                        $elemMatch: {
                            _id: cartData.variantId,
                            variantAvailable: "STOCK",
                            qty: { $gte: 0 },
                        },
                    },
                },
                { $inc: { "variants.$.qty": -quantity } }
            );
            await Product.findOneAndUpdate(
                {
                    _id: obj.productId,
                    productAvailable: "STOCK",
                    variants: {
                        $elemMatch: {
                            _id: cartData.variantId,
                            variantAvailable: "STOCK",
                            qty: { $eq: 0 },
                        },
                    },
                },
                { "variants.$.variantAvailable": "OUTOFSTOCK" }
            );
            await Product.findOneAndUpdate(
                {
                    _id: obj.productId,
                    variants: { $not: { $elemMatch: { qty: { $nin: [0] } } } },
                },
                {
                    productAvailable: "OUTOFSTOCK",
                }
            );
            return res.status(201).send({
                status: 1,
                message: "Order created successfully",
                data: order,
            });
        } else {
            let obj = {
                addedBy: addedBy,
                orderNumber: orderid.generate(),
                paymentMode: paymentMode,
                addressId: addressId,
                productId: productId,
                price: price,
                quantity: quantity,
                variantId: variantId,
            };
            const order = await new Order(obj).save();
            if (!order) {
                return res.status(403).send({
                    status: 0,
                    message: "Order not create",
                    data: [],
                });
            }
            await Product.findOneAndUpdate(
                {
                    _id: productId,
                    productAvailable: "STOCK",
                    variants: {
                        $elemMatch: {
                            _id: variantId,
                            variantAvailable: "STOCK",
                            qty: { $gte: 0 },
                        },
                    },
                },
                { $inc: { "variants.$.qty": -quantity } }
            );
            await Product.findOneAndUpdate(
                {
                    _id: obj.productId,
                    productAvailable: "STOCK",
                    variants: {
                        $elemMatch: {
                            _id: variantId,
                            variantAvailable: "STOCK",
                            qty: { $eq: 0 },
                        },
                    },
                },
                { "variants.$.variantAvailable": "OUTOFSTOCK" }
            );
            await Product.findOneAndUpdate(
                {
                    _id: obj.productId,
                    variants: { $not: { $elemMatch: { qty: { $nin: [0] } } } },
                },
                {
                    productAvailable: "OUTOFSTOCK",
                }
            );

            return res.status(201).send({
                status: 1,
                message: "Order created successfully",
                data: order,
            });
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
