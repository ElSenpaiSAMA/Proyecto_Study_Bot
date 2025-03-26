import React from "react";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import gato from "../assets/gato.png";

const IAButton = () => {
  const navigate = useNavigate();

  return (
    <Avatar
      src={gato}
      sx={{
        position: "fixed", 
        bottom: 20,
        right: 20,
        width: 70,
        height: 70,
        cursor: "pointer",
        backgroundColor: "transparent",
      }}
      onClick={() => navigate("/chat")}
    >
      IA
    </Avatar>
  );
};

export default IAButton;
