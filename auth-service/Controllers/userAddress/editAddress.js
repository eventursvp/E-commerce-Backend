const mongoose = require("mongoose")
const UserAddress = require("model-hook/Model/userAddressModel")
const { constants } = require("model-hook/common_function/constants")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.editAddress = async (req, res, next) => {
    try {
        const { userId, addressId, fullName, address, area, landMark, pinCode, city, state, country, defaultAddress } = req.body
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
        if (!addressId) {
            return res.status(400).send({ status: 0, message: "Address id is required." })
        }
        if (!mongoose.isValidObjectId(addressId)) {
            return res.status(400).send({ status: 0, message: "Invalid address id." })
        }
        const checkAddress = await UserAddress.findOne({ _id: addressId, userId: userId })
        if (!checkAddress) {
            return res.status(404).send({ status: 0, message: "Address not found with given id." })
        }
        let editObj = {}
        if (fullName) {
            if (fullName.length > 50) {
                return res.status(400).send({ status: 0, message: "Full name is too long, Maximum 50 character allowed." })
            }
            editObj.fullName = fullName;
        }
        if (address) {
            if (address.length > 100) {
                return res.status(400).send({ status: 0, message: "Address is too long, Maximum 100 character allowed." })
            }
            editObj.address = address;
        }
        if (area) {
            if (area.length > 100) {
                return res.status(400).send({ status: 0, message: "area name is too long, Maximum 100 character allowed." })
            }
            editObj.area = area
        }
        if (landMark) {
            if (landMark.length > 100) {
                return res.status(400).send({ status: 0, message: "Land mark name is too long, Maximum 100 character allowed." })
            }
            editObj.landMark = landMark
        }
        if (pinCode) {
            if (pinCode.length > 6 || !constants.numberRegex.test(pinCode)) {
                return res.status(400).send({ status: 0, message: "Invalid pin code." })
            }
            editObj.pinCode = pinCode
        }
        if (city) {
            if (city.length > 100) {
                return res.status(400).send({ status: 0, message: "City name is too long, Maximum 100 character allowed." })
            }
            editObj.city = city
        }
        if (state) {
            if (state.length > 60) {
                return res.status(400).send({ status: 0, message: "State name is too long, Maximum 60 character allowed." })
            }
            editObj.state = state
        }
        if (country) {
            if (country.length > 40) {
                return res.status(400).send({ status: 0, message: "Country name is too long, Maximum 40 character allowed." })
            }
            editObj.country = country
        }
        if (defaultAddress && ![true, false].includes(defaultAddress)) {
            return res.status(400).send({ status: 0, message: "Invalid value of default address." })
        }
        if ([true, false].includes(defaultAddress)) {
            await UserAddress.updateMany({ userId: userId }, { $set: { defaultAddress: false } })
            editObj.defaultAddress = defaultAddress
        }
        const updateAddress = await UserAddress.findByIdAndUpdate(
            { userId: (userId), _id: addressId },
            editObj,
            { new: true }
        );
        if (updateAddress) {
            await createApplicationLog(
                "Auth",
                "address edited",
                [{
                    fullName: checkAddress.fullName,
                    address: checkAddress.address,
                    area: checkAddress.area,
                    landMark: checkAddress.landMark,
                    pinCode: checkAddress.pinCode,
                    city: checkAddress.city,
                    state: checkAddress.state,
                    country: checkAddress.country,
                    defaultAddress: checkAddress.defaultAddress,
                }],
                [{
                    fullName: updateAddress.fullName,
                    address: updateAddress.address,
                    area: updateAddress.area,
                    landMark: updateAddress.landMark,
                    pinCode: updateAddress.pinCode,
                    city: updateAddress.city,
                    state: updateAddress.state,
                    country: updateAddress.country,
                    defaultAddress: updateAddress.defaultAddress,
                }],
                loginUser?._id)
            return res.status(201).send({ status: 1, message: "Address updated.", data: updateAddress })
        }
        return res.status(500).send({ status: 0, message: "Address not updated, Please try again" })
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}