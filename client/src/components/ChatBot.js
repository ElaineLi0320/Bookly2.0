import React, { useState } from "react";
import sendQueryToDialogflow from "../utils/dialogflow.js";
import "../styles/ChatBot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleUserInput = async (input) => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const newMessage = { text: trimmedInput, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Send user input to Dialogflow
    const botResponseText = await sendQueryToDialogflow(trimmedInput);
    const botResponse = {
      text: botResponseText,
      sender: "bot",
    };
    setMessages((prevMessages) => [...prevMessages, botResponse]);
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Close" : "❓ Live Chat"}
      </button>

      {isOpen && (
        <div className="chatbot">
          <div className="chat-window">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              onKeyPress={(e) => {
                if (e.key === "Enter") handleUserInput(e.target.value);
              }}
              placeholder="Type your question"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
