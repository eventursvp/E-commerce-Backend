const Order = require("model-hook/Model/orderModel");
const User = require("model-hook/Model/userModel");
const Product = require("model-hook/Model/productModel");
const Cart = require("model-hook/Model/cartModel");
const mongoose = require("mongoose");
const orderid = require("order-id")("key");
const Coupon = require("model-hook/Model/userCoupon");


const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

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
            couponCode,
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
            _id: productId,
            productAvailable: "STOCK",
        });

        if (!productData) {
            return res.status(404).send({
                status: 0,
                message: "Product not available",
                data: [],
            });
        }
        if (!variantData.variants.some((data) => data.price === price)) {
            return res
                .status(403)
                .send({ status: 0, message: "Invalid Amount", data: [] });
        }

        let totalPrice = price * quantity;

        let couponDiscount = 0;
        if (couponCode) {

            const currentDate = new Date();
            const formattedDate = formatDate(currentDate);

            console.log("formattedDate==>",formattedDate);
            const coupon = await Coupon.findOne({
                code: couponCode,
                isActive: true,
                // startDate: { $lte: formattedDate },
                // endDate: { $gte: formattedDate },
                productIds: { $all: [productId] }
            });
            
            if (!coupon) {
                return res
                    .status(404)
                    .send({ status: 0, message: "Coupon not found", data: [] });
            }

            
            // console.log("CouponCode==>",coupon);

            if (coupon) {

                if(!(currentDate <= coupon.endDate)){
                    return res
                    .status(404)
                    .send({ status: 0, message: "Coupon expired", data: [] });
                }

                if (coupon.maxUses === coupon.usedCount) {
                    return res
                        .status(400)
                        .send({
                            status: 0,
                            message: "Coupon usage limit reached",
                            data: [],
                        });
                }

                // Apply coupon discount based on coupon type
                if (coupon.discountType === "PERCENTAGE") {
                    // console.log("coupon.discountTypePER==>",coupon.discountType);
                    couponDiscount = price * (coupon.discountValue / 100);
                    // console.log("coupon.discountValuePER==>",coupon.discountValue);
                } else if (coupon.discountType === "AMOUNT") {
                    // console.log("coupon.discountValueAM==>",coupon.discountValue);
                    couponDiscount = coupon.discountValue;
                }

                // Update coupon usage count
                coupon.usedCount += 1;
                await coupon.save();
            }
        }

        totalPrice -= couponDiscount;

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
                price: totalPrice,
                quantity: cartData.quantity,
                variantId: cartData.variantId,
                couponCode: couponCode,
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
                price: totalPrice,
                quantity: quantity,
                variantId: variantId,
                couponCode: couponCode,
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
