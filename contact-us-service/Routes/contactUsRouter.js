const express = require("express");
const router = express.Router();
const multer = require("multer")
const { jwtValidation } = require("model-hook/middleware/jwtValidation")

const { createContactUs } = require("../Controllers/createContactUs")
const { getContactUsList } = require("../Controllers/getContactUsList")
const { getSingleContactUs } = require("../Controllers/getSingleContactUs")
const { removeContactUs } = require("../Controllers/removeContactUs")


router.post("/createContactUs", createContactUs)
router.post("/getContactUsList", jwtValidation, getContactUsList)
router.post("/getSingleContactUs", jwtValidation, getSingleContactUs)
router.post("/removeContactUs", jwtValidation, removeContactUs)

module.exports = router
