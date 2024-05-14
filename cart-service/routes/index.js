var express = require('express');
var router = express.Router();

router.use("/cart", require("./cartRoutes"));


module.exports = router;
