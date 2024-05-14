var express = require('express');
var router = express.Router();

router.use("/brand", require("./brandRoutes"));


module.exports = router;
