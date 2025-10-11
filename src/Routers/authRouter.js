const express = require("express");

const appRouter = express.Router();
const validateSignUp = require("../utils/validator")
const User = require("../models/user")
const bcrypt = require('bcrypt')
const {userAuth} = require("../middleware/auth")
const jwt = require("jsonwebtoken");

appRouter.post("/signup",async(req,res)=>{
    
try{ 
    //validate signup
    validateSignUp(req);
    //encrpted password
    const {firstName , lastName ,emailId ,password} = req.body;
    
    const passwordhash = await bcrypt.hash(password,10);
    
    const user = new User({
        firstName,lastName,emailId,password:passwordhash
    })
    
    
    const data = await user.save();
  

    res.send("user save data in database successfully. ")
   
 }catch(err){
        res.status(400).send("ERROR : " +err.message)
    }
})


appRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      throw new Error("Invalid email or password.");
    }

    const token = jwt.sign({ _id: user._id }, "DEV@tinder123");

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    res.status(200).send("User login successfully...!!!");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});


appRouter.post("/logout",(req,res)=>{
    res.cookie("token",null,{
        expires : new Date(Date.now())
    })

    res.send("Logout Successful...!!!")
})
module.exports = appRouter;