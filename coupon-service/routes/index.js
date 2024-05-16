var express = require('express');
var router = express.Router();

router.use("/coupon", require("./couponRoutes"));


module.exports = router;
