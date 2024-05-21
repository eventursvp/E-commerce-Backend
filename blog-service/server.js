require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require("cors");
const app = express();
require('model-hook/middleware/connectDb')
const PORT = process.env.PORT || 5010;
const helmet = require('helmet');

//cors
app.use(cors());
app.options("*", cors());

//strictQuery
mongoose.pluralize(null);
mongoose.set("strictQuery", true);
app.use(morgan('tiny'))

//helmet
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'trusted-scripts.com'],
    },
}))

const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '100mb' }));

//json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/upload', express.static('upload'));

const routes = require('./Routes/index');
app.use(routes)

const cronJobs = require('model-hook/common_function/cronFunction');
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`);
})
