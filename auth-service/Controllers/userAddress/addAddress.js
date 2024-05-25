const mongoose = require("mongoose")
const UserAddress = require("model-hook/Model/userAddressModel")
const { constants } = require("model-hook/common_function/constants")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.addAddress = async (req, res, next) => {
    try {
        const { userId, fullName, address, area, landMark, pinCode, city, state, country, defaultAddress } = req.body
        const { loginUser } = req
        if (!userId) {
            return res.status(400).send({ status: 0, message: "User id is required." })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: 0, message: "Invalid user id." })
        }
        if (loginUser?._id != userId) {
            return res.status(403).send({ status: 0, message: "Unauthorized access." })
        }
        if (!fullName) {
            return res.status(400).send({ status: 0, send: "Full name is required." })
        }
        if (fullName.length > 50) {
            return res.status(400).send({ status: 0, message: "Full name is too long, Maximum 50 character allowed." })
        }
        if (!address) {
            return res.status(400).send({ status: 0, message: "address is required." })
        }
        if (address.length > 100) {
            return res.status(400).send({ status: 0, message: "Address is too long, Maximum 100 character allowed." })
        }
        if (area && area.length > 100) {
            return res.status(400).send({ status: 0, message: "area name is too long, Maximum 100 character allowed." })
        }
        if (landMark && landMark.length > 100) {
            return res.status(400).send({ status: 0, message: "Land mark name is too long, Maximum 100 character allowed." })
        }
        if (!pinCode) {
            return res.status(400).send({ status: 0, message: "Pin code is required." })
        }
        if (pinCode.length > 6 || !constants.numberRegex.test(pinCode)) {
            return res.status(400).send({ status: 0, message: "Invalid pin code." })
        }
        if (!city) {
            return res.status(400).send({ status: 0, message: "City is required." })
        }
        if (city.length > 100) {
            return res.status(400).send({ status: 0, message: "City name is too long, Maximum 100 character allowed." })
        }
        if (!state) {
            return res.status(400).send({ status: 0, message: "State is required." })
        }
        if (state.length > 60) {
            return res.status(400).send({ status: 0, message: "State name is too long, Maximum 60 character allowed." })
        }
        if (!country) {
            return res.status(400).send({ status: 0, message: "Country is required." })
        }
        if (country.length > 40) {
            return res.status(400).send({ status: 0, message: "Country name is too long, Maximum 40 character allowed." })
        }
        if (defaultAddress && ![true, false].includes(defaultAddress)) {
            return res.status(400).send({ status: 0, message: "Invalid value of default address." })
        }
        if (defaultAddress === true) {
            const changeOtherDefault = await UserAddress.updateMany(
                { userId: (userId) },
                { $set: { defaultAddress: false } }
            );
        }
        const addAddress = await UserAddress.create({
            userId,
            fullName,
            address,
            area,
            landMark,
            pinCode,
            city,
            state,
            country,
            defaultAddress: defaultAddress === true ? true : false
        })
        if (addAddress) {
            await createApplicationLog("Auth",
                "address added",
                [{
                    fullName: addAddress?.fullName,
                    address: addAddress?.address,
                    area: addAddress?.area,
                    landMark: addAddress?.landMark,
                    pinCode: addAddress?.pinCode,
                    city: addAddress?.city,
                    state: addAddress?.state,
                    country: addAddress?.country,
                    defaultAddress: addAddress?.defaultAddress,
                }],
                [],
                loginUser?._id)
            return res.status(201).send({ status: 1, message: "Address added.", data: addAddress })
        }
        return res.status(500).send({ status: 0, message: "Address not add, Please try again" })
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}