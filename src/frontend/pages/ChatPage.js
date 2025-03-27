import React, { useState } from "react";
import { Box, Typography, Paper, Button, Avatar, TextField, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import "../styles/ChatPage.css";
import gato from "../assets/foto-ia.png";
import userIcon from "../assets/logo.png";

const ChatPage = () => {
  const [chats, setChats] = useState([{ id: 1, messages: [] }]);
  const [activeChat, setActiveChat] = useState(1);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const updateChatMessages = (newMessage) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat ? { ...chat, messages: [...chat.messages, newMessage] } : chat
      )
    );
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { sender: "user", text: input };
    updateChatMessages(newMessage);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        setIsTyping(false);
        return;
      }
      const data = await response.json();
      if (!data.response) {
        setIsTyping(false);
        return;
      }

      updateChatMessages({ sender: "bot", text: data.response });
      setIsTyping(false);
    } catch (error) {
      console.error("Error al obtener respuesta de la IA", error);
      setIsTyping(false);
    }
  };

  const createNewChat = () => {
    const newChat = { id: Date.now(), messages: [] };
    setChats([...chats, newChat]);
    setActiveChat(newChat.id);
  };

  const deleteChat = (id) => {
    setChats(chats.filter((chat) => chat.id !== id));
    if (activeChat === id) setActiveChat(chats[0]?.id || null);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box className="chat-container">
      <Box className="chat-box">
        <Box className="chat-messages">
          {chats.find((chat) => chat.id === activeChat)?.messages.map((msg, index) => (
            <Box key={index} className={`chat-message ${msg.sender}`}>
              {msg.sender === "bot" && <Avatar className="chat-avatar" src={gato} />}
              {msg.sender === "user" && <Avatar className="chat-avatar" src={userIcon} />}
              <Paper className="chat-bubble">{msg.text}</Paper>
            </Box>
          ))}
          {isTyping && (
            <Box className="chat-message bot">
              <Avatar className="chat-avatar" src={gato} />
              <Paper className="chat-bubble">
                <span className="typing-dots">
                  <span className="dot dot1">.</span>
                  <span className="dot dot2">.</span>
                  <span className="dot dot3">.</span>
                </span>
              </Paper>
            </Box>
          )}
        </Box>

        <Box className="message-bar">
          <TextField
            fullWidth
            placeholder="Escribe un mensaje..."
            variant="outlined"
            className="input-field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={sendMessage} className="send-button">Enviar</Button>
        </Box>
      </Box>

      <Box className="chat-list">
        <Typography className="chat-title">Chats</Typography>
        {chats.map((chat) => (
          <Box key={chat.id} className="chat-item" onClick={() => setActiveChat(chat.id)}>
            <Paper className="chat-preview">Chat {chat.id}</Paper>
            <IconButton className="delete-button" onClick={() => deleteChat(chat.id)}>
              <Delete />
            </IconButton>
          </Box>
        ))}
        <Button className="new-chat-button" onClick={createNewChat}>Nuevo Chat</Button>
      </Box>
    </Box>
  );
};

export default ChatPage;