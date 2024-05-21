var express = require('express');
var router = express.Router();

router.use("/saveforlater", require("./saveForLaterRoutes"));


module.exports = router;
