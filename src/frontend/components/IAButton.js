import React from "react";
import { Avatar } from "@mui/material";

const IAButton = () => {
  return (
    <Avatar
      sx={{
        position: "absolute",
        bottom: 20,
        right: 20,
        bgcolor: "#3c8c74",
        width: 50,
        height: 50,
        cursor: "pointer",
      }}
    >
      IA
    </Avatar>
  );
};

export default IAButton;