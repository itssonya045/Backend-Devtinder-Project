const express = require("express");
const  {ConnectDB} = require("./src/middleware/config/database")
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors")

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./src/Routers/authRouter");
const profileRouter = require("./src/Routers/profileRouter")
const requestRouter = require("./src/Routers/request")
const userRouter = require("./src/Routers/userRouter")

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)


ConnectDB().then(() => {
    console.log("Database connection successfully.");

    app.listen(7777, () => {
        console.log("Server working well on port 7777.");
    });
}).catch((err) => {
    console.log("Database connection unsuccessfully.", err);
});

