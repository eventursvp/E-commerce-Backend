var express = require('express');
var router = express.Router();

router.use("/report", require("./reportRoutes"));


module.exports = router;
