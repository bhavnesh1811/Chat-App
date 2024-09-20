import React, { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";

function Chat({ token }) {
  console.log(token);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const getMessages = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/messages/userMessages",
        {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      console.log(data);
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [token]);

  useEffect(() => {
    getMessages();
    const newSocket = io("http://localhost:8080", {
      auth: { token },
      transports: ["websocket"], // Force WebSocket transport
      reconnectionAttempts: 5, // Attempt to reconnect if connection fails
      timeout: 10000, // Set a timeout for the connection
    });

    newSocket.on("connect", () => {
      console.log("Connected to server via WebSocket");
      newSocket.emit("test", "Client connected successfully");
    });

    // Listen for messages from the room
    newSocket.on("message", (msg) => {
      console.log("New message received:", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error.message);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [token]);

  const sendMessage = () => {
    console.log(token);
    if (message.trim() !== "" && socket) {
      const newMessage = {
        sender: token,
        message,
      };
      socket.emit("message", newMessage); // Send message to Room-1
      setMessage("");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Chat Room</h2>
      <div className="h-64 overflow-y-auto mb-4 p-2 border border-gray-200 rounded">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.sender}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-grow mr-2 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
