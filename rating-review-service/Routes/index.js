const express = require("express")
const router = express.Router()

router.use("/ratingReview", require("./ratingReviewRouter"))

module.exports = router