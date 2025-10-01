const express = require("express");
const  {ConnectDB} = require("./src/config/database"); 
const app = express();

 ConnectDB()
.then(() => {
    console.log("Database connection successfully.");

    app.listen(7777, () => {
        console.log("Server working well on port 7777.");
    });
})
.catch((err) => {
    console.log("Database connection unsuccessfully.", err);
});

