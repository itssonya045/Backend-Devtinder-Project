const express = require("express");
const { userAuth } = require("../middleware/auth");
const requestRouter = express.Router();
const Connectionrequest = require("../models/connectionReq")
const User = require("../models/user")


requestRouter.post("/request/send/:status/:toUserId", userAuth,async(req,res)=>{
    try{

       const fromUserId = req.user._id;
       const toUserId = req.params.toUserId;
       const status = req.params.status;

       const allowedStatus =["interested","ignored"]
       if(!allowedStatus.includes(status)){
        throw new Error ("status is invalid : "+status)
       }

       const allowedConnection = await Connectionrequest.findOne({
        $or:[{fromUserId,
        toUserId,
        },{ toUserId: fromUserId , fromUserId:toUserId}]
    })

       if(allowedConnection){
        throw new Error ("Connection request already present...!!!")
       }

       const toUser= await User.findById(toUserId)
       if(!toUser){
        throw new Error("Invalid UserId...!!!")
       }

    


       const Connectionreq = await Connectionrequest({
        fromUserId,toUserId,status
       })
       const data = await Connectionreq.save();


       res.json({
        message : "Connection request send successfully :-"   +status
       })

    }catch(err){
        res.status(400).send("ERROR : " +err.message)
    }

})


requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      throw new Error("Status is invalid: " + status);
    }

    const connectionRequest = await Connectionrequest.findOne({
      _id: requestId,
      toUserId: loggedUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      throw new Error("Connection request is not found");
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.status(200).json({
      message: "Connection request successful: " + status,
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});



module.exports = requestRouter