var express = require('express');
var router = express.Router();

router.use("/termsAndCondition", require("./terms&conditionsRoutes"));


module.exports = router;
