const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async(req,res,next)=>{
    try{
    const cookie = req.cookie;

    const{token}=cookie;
    if(!token){
        throw new Error("token is not valid...!")
    }

    const decodedMessage = await jwt.verify(token,"DEV@tinder123")

    const { id } = decodedMessage;

    const user = await User.findById(id)
    if(!user){
        throw new Error("user is not valid...!")
    }
     req.user = user;
    next();
    
    }catch(err){
         res.status(400).send("ERROR: " + err.message);
    }



}

module.exports = {userAuth}