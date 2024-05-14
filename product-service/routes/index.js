var express = require('express');
var router = express.Router();

router.use("/product", require("./productRoutes"));


module.exports = router;
