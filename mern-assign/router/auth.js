const express = require('express')
const router = express.Router();
const path = require("path")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require("../middleware/authenticate")

require('../db/connect')
const User = require('../model/userSchema')

router.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../e-com', 'build', 'index.html'));
})


// Registration Logic;
router.post('/register', async (req, res) => {
    const { name, email, password, cpassword, userType } = req.body
    if (!name || !email || !password || !cpassword) {
        return res.status(422).json({ err: "Kindly fill all fields" })
    }
    try {
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            return res.status(422).json({ err: "Email already exist" })
        } else if (password !== cpassword) {
            return res.status(422).json({ err: "Password are not Matched" })
        } else {
            const user = new User({ name, email, password, cpassword, userType })

            await user.save()

            res.status(201).json({ message: "user register successfully" })
        }

    } catch (err) {
        console.log(err)
    }

})


//Login route;

router.post('/login', async (req, res) => {

    try {
        var token;
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "kindly fill all field" })

        }
        const userLogin = await User.findOne({ email: email })
        // console.log(userLogin)

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password)

            token = await userLogin.generateAuthToken();
            // console.log(token)

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });

            if (!isMatch) {
                res.status(400).json({ error: "Invalid Credientials password" })
            }
            else {
                if (userLogin.userType === false) {
                    res.status(200).json({ message: "user Login Sucessfully" })
                } else {
                    res.status(200).json({ message: "Admin Login Sucessfully" })

                }
            }
        } else {
            res.status(400).json({ error: "Invalid Credientials email" })
        }
    }
    catch (err) {
        console.log(err)
    }



})
//  User varification.
router.get('/varify', authenticate, (req, res) => {
    res.send(req.userData)
})

router.get("/logout", (req, res)=>{
    res.clearCookie("jwtoken",{path:"/"})
    res.send("Logout")
})

router.put("/addProduct/:_id", async (req, res) => {
    try {
        const get = await User.find(req.params)
        // console.log(...req.body)   
        let value = get[0].products;
        console.log(value)
        value.push(req.body)
        let obj = { products: value }
        let update = await User.updateOne(
            req.params,
            {
                $set: obj
            }
        )
        res.status(200).send({message: "Added Succesfully"})
    } catch (err) {
        res.status(401).send({message:"Something went wrong."});
        console.log(err);
    }



})

// get data form db;
router.get('/data', async(req, res) =>{
    let dbproducts = await User.findOne({"_id":process.env.ID}).lean()
    res.send(dbproducts.products)

})

router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../e-com', 'build', 'index.html'));
})

module.exports = router;