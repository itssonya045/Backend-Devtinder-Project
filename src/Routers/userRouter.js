const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionReq");
const User = require("../models/user");
const userRouter = express.Router();



userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName" , "photoUrl","about","age","gender"]);

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
  }).populate("fromUserId", ["firstName", "lastName" , "photoUrl","about"])
  .populate("toUserId", ["firstName", "lastName" , "photoUrl","about"])


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


userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const page = parseInt(req.query.page)||1;
    let limit = parseInt(req.query.limit)||10
    limit = limit > 50 ? 50 : limit
    const skip = (page - 1) * limit;


    // 1️⃣ Find all connection requests involving the logged user
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedUser._id },
        { toUserId: loggedUser._id }
      ]
    })
      .select("fromUserId toUserId")
      .populate("fromUserId", ["firstName"])
      .populate("toUserId", ["firstName"]);

    // 2️⃣ Create a set of user IDs to hide
    const hideFeed = new Set();

    connectionRequest.forEach((request) => {
      hideFeed.add(request.fromUserId._id.toString());
      hideFeed.add(request.toUserId._id.toString());
    });

    // 3️⃣ Find all users who are NOT connected and NOT the logged user
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideFeed) } },
        { _id: { $ne: loggedUser._id } }
      ]
    }).select("firstName lastName email photoUrl age gender about skills").skip(skip).limit(limit)

    // 4️⃣ Send the feed
    res.send({data : users});

  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = userRouter