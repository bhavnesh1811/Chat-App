const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { 
    type: String, 
    required: true 
  },
  receiver: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  room: { 
    type: String, 
    default: "general" // Optional: for chat rooms or groups
  }
});

const MessageModel = mongoose.model("message", messageSchema);

module.exports = { MessageModel };
