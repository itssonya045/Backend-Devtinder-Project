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
        res.status(400).send("ERROR :" +err.message)
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

app.delete("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        await User.findByIdAndDelete(userId);
        res.send("user deleted successfully.");
    } catch (err) {
        res.send("something went wrong.");
    }
});
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    const data = req.body;
    console.log(data)
    try {
        const isAllowedUpdate = ["age","photoUrl","about","skills"]
        const isAllowed = Object.keys(data).every((k) => isAllowedUpdate.includes(k));

        if(!isAllowed){
            throw new Error ("Update Is Not Valid...!");
            
        }

       if (data.skills && data.skills.length >= 10) {
        throw new Error("Skills Update Is Not Valid...!");}

        
        const user = await User.findByIdAndUpdate(userId, data);
        res.send("user updated successfully.");
    } catch (err) {
        res.send("Error :" +err.message);
    }
});



ConnectDB().then(() => {
    console.log("Database connection successfully.");

    app.listen(7777, () => {
        console.log("Server working well on port 7777.");
    });
}).catch((err) => {
    console.log("Database connection unsuccessfully.", err);
});

