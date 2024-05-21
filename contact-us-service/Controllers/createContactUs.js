const ContactUs = require("model-hook/Model/contactUsModel")
const { constants, disposableEmailProviders } = require("model-hook/common_function/constants")

exports.createContactUs = async (req, res, next) => {
    try {
        const { firstName, lastName, email, phoneNo, message } = req.body

        if (!firstName) {
            return res.status(400).send({ status: 0, message: "First name is required." })
        }
        if (!constants.nameRegex.test(firstName) || firstName.length > 20 || firstName.length < 3) {
            return res.status(400).send({ status: 0, message: "Invalid first name." })
        }

        if (!lastName) {
            return res.status(400).send({ status: 0, message: "Last name is required." })
        }
        if (!constants.nameRegex.test(lastName) || lastName.length > 20 || lastName.length < 3) {
            return res.status(400).send({ status: 0, message: "Invalid last name." })
        }

        if (!email) {
            return res.status(400).send({ status: 0, message: "Email is required." })
        }
        if (!constants.emailRegex.test(email) /*|| disposableEmailProviders.includes(email.split("@")[1])*/) {
            return res.status(400).send({ status: 0, message: "Invalid email." })
        }
        const checkEmail = await ContactUs.findOne({ email: email.toLowerCase() })
        if (checkEmail) {
            return res.status(400).send({ status: 0, message: "This is email is already used." })
        }

        if (!phoneNo) {
            return res.status(400).send({ status: 0, message: "Phone number is required." })
        }
        if (!constants.phoneNoRegex.test(phoneNo) || phoneNo.length < 10) {
            return res.status(400).send({ status: 0, message: "Invalid phone number." })
        }
        const checkPhone = await ContactUs.findOne({ phoneNo: phoneNo })
        if (checkPhone) {
            return res.status(400).send({ status: 0, message: "This phone number is already used." })
        }

        if (!message) {
            return res.status(400).send({ status: 0, message: "Message is required." })
        }
        if (message.length > 100) {
            return res.status(400).send({ status: 0, message: "Maximum 100 character allow into message." })
        }

        const insertData = await ContactUs.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            phoneNo,
            message
        })

        if (insertData) {
            return res.status(201).send({ status: 1, message: "Data inserted successfully.." })
        }
        return res.status(500).send({ status: 0, message: "Data not inserted, Please try again" })

    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}
