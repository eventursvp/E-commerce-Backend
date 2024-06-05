const DeliveryBoy = require('model-hook/Model/deliveryBoyModel')
const VehicleDetails = require("model-hook/Model/vehicleDetailsModel")
const fs = require("fs")
const jwt = require('jsonwebtoken')
const { compileAndSendEmail } = require("model-hook/common_function/mailSending")
const hashPassword = require("model-hook/common_function/hashPassword");
const { constants, disposableEmailProviders } = require("model-hook/common_function/constants")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.registerDeliveryBoy = async (req, res, next) => {
    try {
        const { firstName, lastName, gender, password, confirmPassword, email, vehicleType, vehicleNumber, model, owner } = req.body
        const idCard = req?.files?.idCard
        const licence = req?.files?.licence
        // const host_url = req.get("Origin");
        const host_url = "http://192.168.1.16:5022";
        if (!idCard || idCard?.length <= 0) {
            return res.status(400).send({ status: 0, message: "Id card is required." })
        }
        if (!licence || licence?.length <= 0) {
            return res.status(400).send({ status: 0, message: "Licence is required." })
        }
        const mergeImage = [...idCard, ...licence]
        if (!email) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Email is required." })
        }
        if (!constants.emailRegex.test(email) /*|| disposableEmailProviders.includes(email.split("@")[1])*/) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Invalid email." })
        }
        const checkEmail = await DeliveryBoy.findOne({ email: email.toLowerCase() })
        if (checkEmail) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Email already exist." })
        }
        if (!firstName) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "First name is required." })
        }
        if (!constants.nameRegex.test(firstName) || firstName.length > 20 || firstName.length < 3) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Invalid first name." })
        }
        if (!lastName) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Last name is required." })
        }
        if (!constants.nameRegex.test(lastName) || lastName.length > 20 || lastName.length < 3) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Invalid last name." })
        }
        if (!gender) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Gender is required." })
        }
        if (!["Male", "Female", "Other"].includes(gender)) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Invalid gender." })
        }
        if (!password) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Password is required." })
        }
        if (!confirmPassword) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Confirm password is required." })
        }
        if (password.length < 8) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Password must be at least 8 characters." })
        }
        if (password.length > 25) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Password must be less than 25 characters." })
        }
        if (!constants.passwordRegex.test(password)) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character." })
        }
        if (password !== confirmPassword) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Password and confirm password not match." })
        }
        const hashedPassword = await hashPassword(password)
        if (!vehicleType) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Vehicle Type is requires." })
        }
        if (!["truck", "bike", "car"].includes(vehicleType)) {
            return res.status(400).send({ status: 0, message: "Only truck, bike and car allow into vehicle type" })
        }
        if (vehicleType?.length > 30) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Maximum 30 character allow into vehicle type." })
        }
        if (!vehicleNumber) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Vehicle number is required." })
        }
        if (!constants.numberPlateRegex.test(vehicleNumber)) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Invalid vehicle number." })
        }
        const checkVehicleNumber = await VehicleDetails.findOne({ vehicleNumber: vehicleNumber })

        if (checkVehicleNumber) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "This vehicle number is already used, Please try another." })
        }
        if (!model) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Model is required." })
        }
        if (!constants?.searchPattern.test(model)) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Invalid model value." })
        }
        if (model.length > 30) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Maximum 30 character allow into model." })
        }
        if (!owner) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Owner name is required." })
        }
        if (!constants.nameRegex.test(owner)) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Invalid owner name." })
        }
        if (owner.length > 40 || owner.length < 3) {
            await removeImage(mergeImage)
            return res.status(400).send({ status: 0, message: "Owner name must be have minimum 2 or maximum 40 character." })
        }
        const createVehicleDetails = await VehicleDetails.create({
            vehicleType,
            vehicleNumber,
            model,
            owner,
        })
        let idCardUrls = []
        if (idCard && idCard.length > 0) {
            idCardUrls = await idCard.map((data) => {
                return `http://192.168.1.16:5022/upload/${data?.filename}`
            })
        }
        let licenceUrls = []
        if (licence && licence?.length > 0) {
            licenceUrls = await licence.map((data) => {
                return `http://192.168.1.16:5022/upload/${data?.filename}`
            })
        }

        if (createVehicleDetails && !checkVehicleNumber) {
            const result = await DeliveryBoy.create({
                firstName,
                lastName,
                email: email.toLowerCase(),
                password: hashedPassword,
                gender,
                role: "DeliveryBoy",
                phoneNo: "",
                vehicleDetails: [createVehicleDetails?._id],
                idCard: idCardUrls,
                licence: licenceUrls
            })
            if (result) {
                createVehicleDetails.deliveryBoyId = result._id;
                await createVehicleDetails.save();

                const token = jwt.sign({ email: email.toLowerCase() }, process.env.JWT_TOKEN)
                await this.sendVerificationEmail(email.toLowerCase(), host_url, token, firstName, lastName)
                await createApplicationLog("Delivery", "delivery boy registered", {}, {}, result?._id)
                return res.status(200).send({ status: 1, message: "A verification email has been sent to your email.", token })
            }
            else {
                const removeVehicleDetail = await VehicleDetails.findOneAndDelete({ _id: createVehicleDetails._id })
                return res.status(500).send({ status: 0, message: "Delivery boy not register." })
            }
        }

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}

exports.sendVerificationEmail = async (receiver, hostUrl, token, firstName, lastName) => {
    const url = `${hostUrl}/delivery/verifyEmail/${token}`
    const templateName = "verifyEmail"
    const content = {
        link: url,
        fullName: `${firstName} ${lastName}`
    }
    const subject = 'Verify you email'
    compileAndSendEmail(templateName, receiver, content, subject)

}

const removeImage = (images) => {
    const currentDirectory = './upload';
    if (images && images.length > 0) {
        images.forEach(async (image) => {
            const imagePath = image ? `${currentDirectory}/${image?.filename}` : null;
            if (imagePath) {
                await fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Error deleting image:', err);
                    } else {
                        console.log('Image deleted successfully');
                    }
                });
            }
        })
    }
}