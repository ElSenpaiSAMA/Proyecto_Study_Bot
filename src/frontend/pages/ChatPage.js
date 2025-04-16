import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Paper, Button, Avatar, TextField, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import "../styles/ChatPage.css";
import gato from "../assets/foto-ia.png";
import { useConfig } from '../context/ConfigContext';

const ChatPage = () => {
  const { config } = useConfig();
  const [chats, setChats] = useState([{ id: 1, messages: [] }]);
  const [activeChat, setActiveChat] = useState(1);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, activeChat, isTyping]);

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

      if (!response.ok) throw new Error("Error en la respuesta");
      const data = await response.json();
      if (!data.response) throw new Error("Respuesta vacía");

      updateChatMessages({ sender: "bot", text: data.response });
    } catch (error) {
      console.error("Error al obtener respuesta de la IA", error);
      updateChatMessages({ sender: "bot", text: "Hijo de Puta , intenta de nuevo hay error" });
    } finally {
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

  const isDarkMode = config.mode === "Oscuro";

  return (
    <Box className="chat-container" data-mode={isDarkMode ? "dark" : "light"}>
      <Box className="chat-box">
        <Box className="chat-messages">
          {chats.find((chat) => chat.id === activeChat)?.messages.map((msg, index) => (
            <Box key={index} className={`chat-message ${msg.sender}`}>
              <Avatar
                className="chat-avatar"
                src={msg.sender === "bot" ? gato : config.profilePic || undefined}
              />
              <Paper
                className="chat-bubble"
                sx={{
                  bgcolor: msg.sender === "bot" ? config.colorMensChatIA : config.colorMensChatUs,
                  color: isDarkMode ? "#FFFFFF" : "#000000",
                }}
              >
                {msg.text}
              </Paper>
            </Box>
          ))}
          {isTyping && (
            <Box className="chat-message bot">
              <Avatar className="chat-avatar" src={gato} />
              <Paper
                className="chat-bubble"
                sx={{
                  bgcolor: config.colorMensChatIA,
                  color: isDarkMode ? "#FFFFFF" : "#000000",
                }}
              >
                <span className="typing-dots">
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                </span>
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
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
            multiline
            maxRows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "24px",
                bgcolor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
                color: isDarkMode ? "#FFFFFF" : "#000000",
                "& fieldset": { border: "none" },
                "&:hover fieldset": { border: "none" },
                "&.Mui-focused fieldset": { border: "none" },
              },
            }}
          />
          <Button
            onClick={sendMessage}
            className="send-button"
            sx={{
              bgcolor: isDarkMode ? "#1976D2" : "#1976D2",
              color: "#FFFFFF",
              "&:hover": { bgcolor: isDarkMode ? "#115293" : "#115293" },
              borderRadius: "24px",
              marginLeft: "12px",
              minWidth: "80px",
            }}
          >
            Enviar
          </Button>
        </Box>
      </Box>

      {/* Lista de chats */}
      <Box className="chat-list">
        <Typography className="chat-title">Chats</Typography>
        <Box className="chat-list-container">
          {chats.map((chat) => (
            <Box
              key={chat.id}
              className="chat-item"
              onClick={() => setActiveChat(chat.id)}
            >
              <Paper
                className="chat-preview"
                sx={{
                  bgcolor: isDarkMode ? "#616161" : "#FFFFFF",
                  color: isDarkMode ? "#FFFFFF" : "#000000",
                }}
              >
                Chat {chat.id}
              </Paper>
              <IconButton
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                sx={{ bgcolor: config.eliminarChatColor, color: "#FFFFFF" }}
              >
                <Delete />
              </IconButton>
            </Box>
          ))}
        </Box>
        <Button
          className="new-chat-button"
          onClick={createNewChat}
          sx={{
            bgcolor: config.nuevoChatColor,
            color: "#FFFFFF",
            "&:hover": { bgcolor: config.nuevoChatColor, opacity: 0.9 },
            borderRadius: "12px",
          }}
        >
          Nuevo Chat
        </Button>
      </Box>
    </Box>
  );
};

export default ChatPage;