const express = require("express");
const  {ConnectDB} = require("./src/config/database"); 
const app = express();
const User = require("./src/models/user")

 app.post("/signup",async(req,res)=>{

    const user = new User({

         firstName : "shri",
          lastName :"rakshe",
          emailId : "shri123@gmail.com",
          password : "shri123"

    })
    
    try{
    const data = await user.save();
    console.log(data);

    res.send("user save data in database successfully. ")
    }catch(err){
        res.status.send("ERROR", +err.message)
    }
 })







ConnectDB().then(() => {
    console.log("Database connection successfully.");

    app.listen(7777, () => {
        console.log("Server working well on port 7777.");
    });
}).catch((err) => {
    console.log("Database connection unsuccessfully.", err);
});

