const express = require('express');
const app = express();
const path = require("path")
const mongoose = require('mongoose')
const dotenv = require('dotenv')
var cookies = require("cookie-parser");
// const cors = require("cors")

dotenv.config({ path: './config.env' })
require('./db/connect')
// const User = require('./model/userSchema');
// app.use(cors())

app.use(express.json());
app.use(cookies())
//link the router files to make our router easy;

app.use(express.static(path.join(__dirname, './e-com', 'build')));

app.use(require('./router/auth'))
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`)
})