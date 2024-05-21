const express = require("express")
const router = express.Router()

router.use("/contactUs", require("./contactUsRouter"))

module.exports = router