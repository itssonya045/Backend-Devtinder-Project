const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middleware/auth")
const validEditprofile = require("../utils/validator")


profileRouter.get("/profile/views",userAuth,async(req,res)=>{
    try{
   const user = req.user;
    res.send(user)
    }catch(err){
      res.status(400).send("ERROR: " + err.message);
}
})

profileRouter.patch("/profile/edits",userAuth,async(req,res)=>{
  try{
   if(!validEditprofile(req)){
    throw new Error("Invalid Edits Data")
   }

   const loggedUser = req.user

   Object.keys(req.body).forEach((key)=>loggedUser[key]=req.body[key])
   await loggedUser.save();


   res.json(
    {
      message : "your profile updated successfully...!",
      data : loggedUser,
    }
   )
  }catch(err){
    res.status(400).send("Error :" +err.message)
  }
})

module.exports = profileRouter