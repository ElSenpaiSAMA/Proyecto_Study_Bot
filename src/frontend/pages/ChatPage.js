import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Paper, Button, Avatar, TextField, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import "../styles/ChatPage.css";
import gato from "../assets/foto-ia.png";
import { useConfig } from '../context/ConfigContext';

const AuthContext = React.createContext({ userId: null });
const useAuth = () => useContext(AuthContext);

const ChatPage = () => {
  const { config } = useConfig();
  const { userId } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (userId) {
      fetchChats();
    }
  }, [userId]);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat);
    } else {
      setMessages([]);
    }
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const fetchChats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/chats/${userId}`);
      if (!response.ok) throw new Error("Error fetching chats");
      const data = await response.json();
      setChats(data);
      if (data.length > 0 && !activeChat) {
        setActiveChat(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await fetch(`http://localhost:5000/chat/${chatId}/messages?user_id=${userId}`);
      if (!response.ok) throw new Error("Error fetching messages");
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeChat) return;
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, message: input, chat_id: activeChat }),
      });

      if (!response.ok) throw new Error("Error en la respuesta");
      const data = await response.json();
      if (!data.response) throw new Error("Respuesta vacía");

      setMessages((prev) => [...prev, { sender: "ai", text: data.response }]);
    } catch (error) {
      console.error("Error al obtener respuesta de la IA", error);
      setMessages((prev) => [...prev, { sender: "ai", text: "Error, intenta de nuevo" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, message: "Iniciar nuevo chat" }),
      });
      if (!response.ok) throw new Error("Error creating chat");
      const data = await response.json();
      const newChat = { id: data.chat_id, title: `Chat ${userId}` };
      setChats((prev) => [...prev, newChat]);
      setActiveChat(data.chat_id);
      setMessages([]);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const deleteChat = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/chat/${id}?user_id=${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error deleting chat");
      }
      setChats((prev) => prev.filter((chat) => chat.id !== id));
      if (activeChat === id) {
        const remainingChats = chats.filter((chat) => chat.id !== id);
        setActiveChat(remainingChats[0]?.id || null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error deleting chat:", error.message);
      alert(`No se pudo eliminar el chat: ${error.message}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const isDarkMode = config.mode === "Oscuro";

  if (!userId) {
    return (
      <Box className="chat-container">
        <Typography color="error">Por favor, inicia sesión para usar el chat.</Typography>
      </Box>
    );
  }

  return (
    <Box className="chat-container" data-mode={isDarkMode ? "dark" : "light"}>
      <Box className="chat-box">
        <Box className="chat-messages">
          {messages.map((msg, index) => (
            <Box key={index} className={`chat-message ${msg.sender}`}>
              <Avatar
                className="chat-avatar"
                src={msg.sender === "ai" ? gato : config.profilePic || undefined}
                alt={msg.sender === "ai" ? "Bot" : "Usuario"}
              />
              <Paper
                className="chat-bubble"
                sx={{
                  bgcolor: msg.sender === "ai" ? config.colorMensChatIA : config.colorMensChatUs,
                  color: isDarkMode ? "#FFFFFF" : "#000000",
                }}
              >
                {msg.text}
              </Paper>
            </Box>
          ))}
          {isTyping && (
            <Box className="chat-message ai">
              <Avatar className="chat-avatar" src={gato} alt="Bot" />
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
            disabled={!activeChat}
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
            disabled={!activeChat}
          >
            Enviar
          </Button>
        </Box>
      </Box>

      <Box className="chat-list">
        <Typography className="chat-title">Chats</Typography>
        <Box className="chat-list-container">
          {chats.map((chat) => (
            <Box
              key={chat.id}
              className={`chat-item ${activeChat === chat.id ? "active" : ""}`}
              onClick={() => setActiveChat(chat.id)}
            >
              <Paper
                className="chat-preview"
                sx={{
                  bgcolor: isDarkMode ? "#616161" : "#FFFFFF",
                  color: isDarkMode ? "#FFFFFF" : "#000000",
                  padding: "8px",
                  cursor: "pointer",
                }}
              >
                {chat.title}
              </Paper>
              <IconButton
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                sx={{ bgcolor: config.eliminarChatColor || "#f44336", color: "#FFFFFF" }}
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
            bgcolor: config.nuevoChatColor || "#1976D2",
            color: "#FFFFFF",
            "&:hover": { bgcolor: config.nuevoChatColor || "#115293", opacity: 0.9 },
            borderRadius: "12px",
            marginTop: "12px",
            padding: "8px 16px",
            width: "100%",
          }}
        >
          Nueva Conversación
        </Button>
      </Box>
    </Box>
  );
};

const ChatPageWithAuth = () => {
  const auth = { userId: 1 };
  return (
    <AuthContext.Provider value={auth}>
      <ChatPage />
    </AuthContext.Provider>
  );
};

export default ChatPageWithAuth;