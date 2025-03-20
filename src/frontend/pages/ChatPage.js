import React from "react";
import { Box, Typography, Paper, Button, Avatar, Divider, TextField } from "@mui/material";
import "../styles/ChatPage.css";
import { Delete } from "@mui/icons-material";

const ChatPage = () => {
  return (
    <Box display="flex" height="100vh">
      
      <Box flexGrow={1} className="chat-container">
        <Box className="chat-box">
          {[...Array(4)].map((_, index) => (
            <Box key={index} className="chat-message">
              <Avatar className="chat-avatar" />
              <Paper className="chat-bubble" />
            </Box>
          ))}
        </Box>
        
        <Box className="chat-list">
          <Typography className="chat-title">Chats</Typography>
          {[...Array(6)].map((_, index) => (
            <Box key={index} className="chat-item">
              <Paper className="chat-preview" />
              <Button className="delete-button">
                <Delete />
              </Button>
            </Box>
          ))}
          <Button className="new-chat-button">Nuevo Chat</Button>
        </Box>
        
        <Box className="message-bar">
          <TextField fullWidth placeholder="Escriba lo que quieras consultar" variant="outlined" className="input-field" />
          <Button className="attach-button">Adjuntar Archivos</Button>
          <Avatar className="mic-button">🎤</Avatar>
        </Box>
      </Box>
      
    </Box>
  );
};

export default ChatPage;