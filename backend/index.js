const express = require("express");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const { connection } = require("./Config/db");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const { UserRouter } = require("./Routes/user.route");
const { MessageModel } = require("./Models/message.model");
const { MessageRouter } = require("./Routes/message.route");
const { getUser } = require("./Middlewares/user.authentication");

app.get("/", (req, res) => {
  res.status(200).send("API is working fine");
});

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*", // Restrict this in production to your client domain
  })
);

// RESTful API - User Registration and Login
app.use("/users", UserRouter);
app.use("/messages", MessageRouter);

io.on("connection", (socket) => {
  console.log(`User connected`);

  // Join Room-1 for every connected user
  socket.join("Room-1");

  // Handle receiving a message and broadcasting to Room-1
  socket.on("message", async (data) => {
    const { sender } = data;
    let res = await getUser(sender);
    console.log(res);
    const fullMessage = {
      sender: res.email, // Placeholder, should use actual sender's username or id
      receiver: "all", // Placeholder, you should manage actual receiver logic
      content: data.message,
      room: "Room-1",
      timestamp: new Date(),
    };

    console.log("Received message:", fullMessage);

    // // Broadcast message to all users in Room-1 (including sender)
    io.to("Room-1").emit("message", fullMessage);

    // Save the message to MongoDB
    try {
      const newMessage = new MessageModel(fullMessage);
      await newMessage.save();
      console.log("Message saved to DB");
    } catch (error) {
      console.error("Error saving message to DB:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected`);
  });
});

const PORT = process.env.PORT || 5555;

const startServer = async () => {
  try {
    await connection;
    console.log("Connected to DB");
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log("Failed to connect to DB:", e);
    process.exit(1);
  }
};

startServer();
