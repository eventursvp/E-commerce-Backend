const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 5001
const routes = require('./routes/index');
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');

const path = require("path")
require("dotenv").config();
require("../model-hook/middleware/connectDb")


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
