const express = require("express");
const  {ConnectDB} = require("./src/config/database"); 
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./src/Routers/authRouter");
const profileRouter = require("./src/Routers/profileRouter")
const requestRouter = require("./src/Routers/request")

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)


ConnectDB().then(() => {
    console.log("Database connection successfully.");

    app.listen(7777, () => {
        console.log("Server working well on port 7777.");
    });
}).catch((err) => {
    console.log("Database connection unsuccessfully.", err);
});

