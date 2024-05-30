const express = require("express");
const router = express.Router();
const { jwtValidation } = require("model-hook/middleware/jwtValidation");
const { registerUser } = require("../Controllers/userRegister");
const { loginUser } = require("../Controllers/loginUser");
const { verifyEmail } = require("../Controllers/verifyEmail");
const { userProfile } = require("../Controllers/userProfile");
const { updateUserProfile, } = require("../Controllers/updateUserProfile");
const { changePassword } = require("../Controllers/changePassword");
const { forgetPassword } = require("../Controllers/forgetPassword");
const { resetPassword } = require("../Controllers/resetPassword");
const { getAllUser } = require("../Controllers/getAllUser");
const { logOutUser } = require("../Controllers/logOutUser");
const { deactiveUser } = require("../Controllers/deactiveUser");

const { enable2FA, sendOtp, verifyOtp, resendOtp } = require("../Controllers/2FA")

const { addAddress } = require("../Controllers/userAddress/addAddress")
const { getOneAddress } = require("../Controllers/userAddress/getOneAddress")
const { getAllAddresses } = require("../Controllers/userAddress/getAllAddresses")
const { removeAddress } = require("../Controllers/userAddress/removeAddress")
const { setDefaultAddress } = require("../Controllers/userAddress/setDefaultAddress")
const { editAddress } = require("../Controllers/userAddress/editAddress")
const { getAuthLogs } = require("../Controllers/getAuthLogs")

router.post("/registerUser", registerUser);
router.get('/verifyEmail/:token', verifyEmail);
router.post("/loginUser", loginUser);
router.post("/userProfile", jwtValidation, userProfile);
router.post("/updateUserProfile", jwtValidation, updateUserProfile);
router.post("/changePassword", jwtValidation, changePassword);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword/:token", resetPassword);
router.post("/logOutUser", jwtValidation, logOutUser);
router.post("/getAllUser", jwtValidation, getAllUser);
router.post("/deactiveUser", jwtValidation, deactiveUser);

router.post("/enable2FA", jwtValidation, enable2FA);
router.post("/sendOtp", jwtValidation, sendOtp);
router.post("/resendOtp", resendOtp)
router.post("/verifyOtp", verifyOtp);

router.post("/addAddress", jwtValidation, addAddress)
router.post("/getOneAddress", jwtValidation, getOneAddress)
router.post("/getAllAddresses", jwtValidation, getAllAddresses)
router.post("/removeAddress", jwtValidation, removeAddress)
router.post("/setDefaultAddress", jwtValidation, setDefaultAddress)
router.post("/editAddress", jwtValidation, editAddress)

router.post("/getAuthLogs", jwtValidation, getAuthLogs)

module.exports = router;
