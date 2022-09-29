const mongoose = require('mongoose');

const DB = process.env.DATABASE;

//Connect data from server;
mongoose.connect(DB)
.then(() => {
    console.log("connected Successful")
}).catch((err) =>{console.log(err)})
