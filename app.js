const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { ConnectDB } = require("./src/middleware/config/database");
const { initializeSocket } = require("./src/utils/socket");
const http = require("http");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const authRouter = require("./src/Routers/authRouter");
const profileRouter = require("./src/Routers/profileRouter");
const requestRouter = require("./src/Routers/request");
const userRouter = require("./src/Routers/userRouter");
const chatRouter = require("./src/Routers/chatRouter");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const server = http.createServer(app);
initializeSocket(server);

ConnectDB()
  .then(() => {
    console.log("Database connected successfully.");

    server.listen(7777, () => {
      console.log("Server running on port 7777 🚀");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
