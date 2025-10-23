const mongoose = require("mongoose");

const connectionReqSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
       ref : "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["interested", "accepted", "ignored", "rejected"], 
    },
  },
  {
    timestamps: true,
  }
);
connectionReqSchema.pre("save",function(next){
    const ConnectionRequest = this
    if(ConnectionRequest.fromUserId.equals(ConnectionRequest.toUserId)){
        throw new Error("Cannot send the Connection request yourself...!!!")
        
    }
    next();

})

module.exports = mongoose.model("ConnectionRequest", connectionReqSchema);
