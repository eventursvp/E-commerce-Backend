const express = require('express');
const { jwtValidation } = require("model-hook/middleware/jwtValidation")

const router = express.Router();

const {addReportOnProductReview,addReportOnBlogComment,addReportOnProduct} = require('../controller/addReport');

const {getOneReport,getAllReport} = require('../controller/getReports');

const {removeReport} =require("../controller/removeReport")


router.post('/addReportOnProductReview',jwtValidation,addReportOnProductReview);
router.post('/addReportOnBlogComment',jwtValidation,addReportOnBlogComment);
router.post('/addReportOnProduct',jwtValidation,addReportOnProduct);

router.post('/getOneReport',jwtValidation,getOneReport);
router.post('/getAllReport',jwtValidation,getAllReport);

router.post('/removeReport',jwtValidation,removeReport);



module.exports = router;