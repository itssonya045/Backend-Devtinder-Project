const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionReq");
const userRouter = express.Router();


userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName" , "photoUrl"]);

    res
      .status(200)
      .json({ message: "Data fetch successful.", data: connectionRequest });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections",userAuth , async(req,res)=>{


  try{
    const loggedUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or :[
        {
        toUserId: loggedUser._id , status : "accepted",
        },
       {
         fromUserId : loggedUser._id , status : "accepted"
      }]
  }).populate("fromUserId", ["firstName", "lastName" , "photoUrl"])
  .populate("toUserId", ["firstName", "lastName" , "photoUrl"])


  const data = connectionRequest.map((k) =>
  k.toUserId._id.toString() === loggedUser._id.toString()
    ? k.fromUserId
    : k.toUserId
);



    res.json({data })

  }catch(err){
    res.status(400).send("ERROR: " + err.message);
  }
})
module.exports = userRouter