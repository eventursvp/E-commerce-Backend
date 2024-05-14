const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const port = process.env.PORT || 5009
const routes = require('./routes/index');
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const mongoSanitize = require('express-mongo-sanitize');

require("dotenv").config();
require("../model-hook/middleware/connectDb");


app.use(cors());
app.options('*', cors());
app.use(helmet());
app.use(mongoSanitize());


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(routes)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
});
