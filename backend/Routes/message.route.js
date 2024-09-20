const express = require("express");
const { MessageModel } = require("../Models/message.model");
const { userAuthentication } = require("../Middlewares/user.authentication");

const MessageRouter = express.Router();

// Route to get all messages sent or received by the authenticated user
MessageRouter.get("/userMessages", userAuthentication, async (req, res) => {
  try {
    
    const messages = await MessageModel.find();
    console.log(messages);

    res.json(messages);
  } catch (error) {
    console.error("Error fetching user messages:", error);
    res.status(500).send("Error retrieving messages");
  }
});

module.exports = { MessageRouter };
