var express = require('express');
var router = express.Router();

router.use("/category", require("./categoryRoutes"));


module.exports = router;
