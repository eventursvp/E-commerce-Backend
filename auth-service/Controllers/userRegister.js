const User = require('model-hook/Model/userModel')
const jwt = require('jsonwebtoken')
const { compileAndSendEmail } = require("model-hook/common_function/mailSending")
const hashPassword = require("model-hook/common_function/hashPassword");
const { constants, disposableEmailProviders } = require("model-hook/common_function/constants")
const { createApplicationLog } = require("model-hook/common_function/createLog")

exports.registerUser = async (req, res, next) => {
    try {
        const { firstName, lastName, gender, password, confirmPassword, email } = req.body
        // const host_url = req.get("Origin");
        const host_url = "http://192.168.1.8:8001";
        if (!email) {
            return res.status(400).send({ status: 0, message: "Email is required." })
        }
        if (!constants.emailRegex.test(email) /*|| disposableEmailProviders.includes(email.split("@")[1])*/) {
            return res.status(400).send({ status: 0, message: "Invalid email." })
        }
        const checkEmail = await User.findOne({ email: email.toLowerCase() })
        if (checkEmail) {
            return res.status(400).send({ status: 0, message: "Email already exist." })
        }
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
        if (!gender) {
            return res.status(400).send({ status: 0, message: "Gender is required." })
        }
        if (!["Male", "Female", "Other"].includes(gender)) {
            return res.status(400).send({ status: 0, message: "Invalid gender." })
        }
        if (!password) {
            return res.status(400).send({ status: 0, message: "Password is required." })
        }
        if (!confirmPassword) {
            return res.status(400).send({ status: 0, message: "Confirm password is required." })
        }
        if (password.length < 8) {
            return res.status(400).send({ status: 0, message: "Password must be at least 8 characters." })
        }
        if (password.length > 25) {
            return res.status(400).send({ status: 0, message: "Password must be less than 25 characters." })
        }
        if (!constants.passwordRegex.test(password)) {
            return res.status(400).send({ status: 0, message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character." })
        }
        if (password !== confirmPassword) {
            return res.status(400).send({ status: 0, message: "Password and confirm password not match." })
        }
        const hashedPassword = await hashPassword(password)

        const result = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            gender,
            role: "User",
            phoneNo: ""
        })
        if (!result) {
            return res.status(500).send({ status: 0, message: "User not register." })
        }
        const token = jwt.sign({ email: email.toLowerCase() }, process.env.JWT_TOKEN)
        await this.sendVerificationEmail(email.toLowerCase(), host_url, token, firstName, lastName)
        await createApplicationLog("Auth", "user registered", {}, {}, result?._id)
        return res.status(200).send({ status: 1, message: "A verification email has been sent to your email.", token })
    } catch (error) {
        console.log('error =>', error);
        return res.status(500).send({ status: 0, message: "Something went wrong", error });
    }
}

exports.sendVerificationEmail = async (receiver, hostUrl, token, firstName, lastName) => {
    const url = `${hostUrl}/users/verifyEmail/${token}`
    const templateName = "verifyEmail"
    const content = {
        link: url,
        fullName: `${firstName} ${lastName}`
    }
    const subject = 'Verify you email'
    compileAndSendEmail(templateName, receiver, content, subject)

}


