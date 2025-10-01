const express = require("express");
const  {ConnectDB} = require("./src/config/database"); 
const app = express();
const User = require("./src/models/user")
app.use(express.json())

 app.post("/signup",async(req,res)=>{
    

    const user = new User(req.body)
    
    try{
    const data = await user.save();
    console.log(data);

    res.send("user save data in database successfully. ")
    }catch(err){
        res.status.send("ERROR", +err.message)
    }
 })


app.get("/user", async (req, res) => {
    const email = req.body.emailId;
    try {
        const data = await User.find({ emailId: email });
        if (data.length === 0) {
            return res.status(404).send("Email Not Found in database.");
        }
        res.send(data);
    } catch (err) {
        res.send("something went wrong.");
    }
});


app.get("/feed",async(req,res)=>{

    try{
        const users = await User.find({})
        res.send(users)

    }catch (err) {
        res.send("something went wrong.");
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

