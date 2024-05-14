var express = require('express');
var router = express.Router();

router.use("/banner", require("./bannerRoutes"));


module.exports = router;
