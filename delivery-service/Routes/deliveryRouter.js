const express = require("express");
const multer = require("multer")
const path = require("path")
const router = express.Router();
const { jwtValidation } = require("model-hook/middleware/jwtValidation");
const { registerDeliveryBoy } = require("../Controllers/registerDeliveryBoy");
const { verifyEmail } = require("../Controllers/verifyEmail");
const { loginDeliveryBoy } = require("../Controllers/loginDeliveryBoy")
const { deliveryBoyProfile } = require("../Controllers/deliveryBoyProfile")
const { forgetPassword } = require("../Controllers/forgetPassword")
const { resetPassword } = require("../Controllers/resetPassword")
const { changePassword } = require("../Controllers/changePassword")
const { updateDeliveryBoyProfile } = require("../Controllers/updateDeliveryBoyProfile")
const { getListOfDeliveryBoys } = require("../Controllers/getListOfDeliveryBoys")
const { getSingleDeliveryBoy } = require("../Controllers/getSingleDeliveryBoy")
const { deactiveDeliveryBoy } = require("../Controllers/deactiveDeliveryBoy")
const { logoutDeliveryBoy } = require("../Controllers/logoutDeliveryBoy")
const { removeDeliveryBoyAccount } = require("../Controllers/removeDeliveryBoyAccount")
const { addVehicle } = require("../Controllers/addVehicle")
const { getSingleVehicleDetail } = require("../Controllers/getSingleVehicleDetail")
const { updateVehicleDetails } = require("../Controllers/updateVehicleDetails")
const { removeVehicle } = require("../Controllers/removeVehicle")
const { sendDeliveryAssignmentRequest } = require("../Controllers/sendDeliveryAssignmentRequest")
const { listOfDeliveryAssignRequest } = require("../Controllers/listOfDeliveryAssignRequest")
const { acceptDeliveryOrder } = require("../Controllers/acceptDeliveryOrder")
const { myDeliveryList } = require("../Controllers/myDeliveryList")
const { qrcodeOfOrderPrice } = require("../Controllers/qrcodeOfOrderPrice")
const { collectPaymentOnDelivery } = require("../Controllers/collectPaymentOnDelivery")
const { sendOrderOtp } = require("../Controllers/sendOrderOtp")
const { resendOrderOtp } = require("../Controllers/resendOrderOtp")
const { verifyOrderOtp } = require("../Controllers/verifyOrderOtp")
const { collectDeliveryPaymentFromDeliveryBoy } = require("../Controllers/collectDeliveryPaymentFromDeliveryBoy")
const { giveChangeToDeliveryBoy } = require("../Controllers/giveChangeToDeliveryBoy")
const { returnChangeFromDeliveryBoy } = require("../Controllers/returnChangeFromDeliveryBoy")
const { giveFeedbackToDeliveryBoy } = require("../Controllers/giveFeedbackToDeliveryBoy")
const { getAllFeedbackOfDeliveryBoy } = require("../Controllers/getAllFeedbackOfDeliveryBoy")
const { getSingleFeedbackOfDeliveryBoy } = require("../Controllers/getSingleFeedbackOfDeliveryBoy")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload')
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname.replace(/ /g, '_'));
    },
})

const generateImageFilter = (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, JPEG and PNG are allowed.'));
    }
};

const upload = multer({ storage: storage, fileFilter: generateImageFilter }).fields([
    { name: "idCard", maxCount: 2 },
    { name: "licence", maxCount: 2 }
])

router.post("/registerDeliveryBoy", upload, registerDeliveryBoy);
router.get("/verifyEmail/:token", verifyEmail);
router.post("/loginDeliveryBoy", loginDeliveryBoy)
router.post("/deliveryBoyProfile", jwtValidation, deliveryBoyProfile)
router.post("/forgetPassword", forgetPassword)
router.post("/resetPassword/:token", resetPassword)
router.post("/changePassword", jwtValidation, changePassword)
router.post("/updateDeliveryBoyProfile", upload, jwtValidation, updateDeliveryBoyProfile)
router.post("/getListOfDeliveryBoys", jwtValidation, getListOfDeliveryBoys)
router.post("/getSingleDeliveryBoy", jwtValidation, getSingleDeliveryBoy)
router.post("/deactiveDeliveryBoy", jwtValidation, deactiveDeliveryBoy)
router.post("/logoutDeliveryBoy", jwtValidation, logoutDeliveryBoy)
router.post("/removeDeliveryBoyAccount", jwtValidation, removeDeliveryBoyAccount)
router.post("/addVehicle", jwtValidation, addVehicle)
router.post("/getSingleVehicleDetail", jwtValidation, getSingleVehicleDetail)
router.post("/updateVehicleDetails", jwtValidation, updateVehicleDetails)
router.post("/removeVehicle", jwtValidation, removeVehicle)
router.post("/sendDeliveryAssignmentRequest", jwtValidation, sendDeliveryAssignmentRequest)
router.post("/listOfDeliveryAssignRequest", jwtValidation, listOfDeliveryAssignRequest)
router.post("/acceptDeliveryOrder", jwtValidation, acceptDeliveryOrder)
router.post("/myDeliveryList", jwtValidation, myDeliveryList)
router.post("/qrcodeOfOrderPrice", jwtValidation, qrcodeOfOrderPrice)
router.post("/collectPaymentOnDelivery", jwtValidation, collectPaymentOnDelivery)
router.post("/sendOrderOtp", jwtValidation, sendOrderOtp)
router.post("/resendOrderOtp", jwtValidation, resendOrderOtp)
router.post("/verifyOrderOtp", jwtValidation, verifyOrderOtp)
router.post("/collectDeliveryPaymentFromDeliveryBoy", jwtValidation, collectDeliveryPaymentFromDeliveryBoy)
router.post("/giveChangeToDeliveryBoy", jwtValidation, giveChangeToDeliveryBoy)
router.post("/returnChangeFromDeliveryBoy", jwtValidation, returnChangeFromDeliveryBoy)
router.post("/giveFeedbackToDeliveryBoy", jwtValidation, giveFeedbackToDeliveryBoy)
router.post("/getAllFeedbackOfDeliveryBoy", jwtValidation, getAllFeedbackOfDeliveryBoy)
router.post("/getSingleFeedbackOfDeliveryBoy", jwtValidation, getSingleFeedbackOfDeliveryBoy)

module.exports = router;
