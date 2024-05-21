const express = require("express");
const router = express.Router();
const multer = require("multer")
const { jwtValidation } = require("model-hook/middleware/jwtValidation")

const { addProductRating } = require("../Controllers/addProductRating")
const { addProductReview } = require("../Controllers/addProductReview")
const { getAllRatingReviewOfProduct } = require("../Controllers/getAllRatingReviewOfProduct")
const { getStarWiseRating } = require("../Controllers/getStarWiseRating")
const { getOneProductRatingReview } = require("../Controllers/getOneProductRatingReview")
const { removeProductRatingReview } = require("../Controllers/removeProductRatingReview")
const { updateProductReview } = require("../Controllers/updateProductReview")
const { likeProductReview } = require("../Controllers/likeProductReview")
const { disLikeProductReview } = require("../Controllers/disLikeProductReview")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload')
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname.replace(/ /g, '_'));
    },
})

const upload = multer({ storage: storage }).fields([
    { name: "reviewImages", maxCount: 10 }
])


router.post("/addProductRating", jwtValidation, addProductRating)
router.post("/addProductReview", jwtValidation, upload, addProductReview)
router.post("/getAllRatingReviewOfProduct", getAllRatingReviewOfProduct)
router.post("/getStarWiseRating", getStarWiseRating)
router.post("/getOneProductRatingReview", getOneProductRatingReview)
router.post("/removeProductRatingReview", jwtValidation, removeProductRatingReview)
router.post("/updateProductReview", jwtValidation, upload, updateProductReview)
router.post("/likeProductReview", jwtValidation, likeProductReview)
router.post("/disLikeProductReview", jwtValidation, disLikeProductReview)


module.exports = router
