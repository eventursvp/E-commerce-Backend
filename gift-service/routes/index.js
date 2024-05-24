var express = require('express');
var router = express.Router();

router.use("/gift", require("./giftRoutes"));


module.exports = router;