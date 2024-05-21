const express = require("express")
const router = express.Router()

router.use("/blogs", require("./blogRouter"))

module.exports = router