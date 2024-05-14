var express = require('express');
var router = express.Router();

router.use("/order", require("./orderRoutes"));


module.exports = router;
