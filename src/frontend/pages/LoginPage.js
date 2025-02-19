import React from "react";
import { Box, TextField, Button, Typography, IconButton } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import LanguageIcon from "@mui/icons-material/Language";

const LoginPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box sx={{ backgroundColor: "rgba(0, 0, 0, 0.6)", p: 4, borderRadius: 2, boxShadow: 3, width: 400 }}>
        <Box display="flex" justifyContent="center" mb={2}>
          <img src="/logo.png" alt="StudyBot Logo" style={{ width: 80 }} />
        </Box>
        <Typography variant="h6" color="white" textAlign="center" gutterBottom>
          A Virtual Study Assistant App
        </Typography>
        
        <TextField
          fullWidth
          margin="normal"
          variant="outlined"
          label="Email"
          InputProps={{ style: { backgroundColor: "#fff" } }}
        />
        <TextField
          fullWidth
          margin="normal"
          variant="outlined"
          type="password"
          label="Contraseña"
          InputProps={{ style: { backgroundColor: "#fff" } }}
        />
        
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Iniciar Sesión
        </Button>
        
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          sx={{ mt: 2, backgroundColor: "white" }}
        >
          Iniciar Sesión con Google
        </Button>
        
        <Typography
          variant="body2"
          color="white"
          textAlign="center"
          sx={{ mt: 2, cursor: "pointer", textDecoration: "underline" }}
        >
          Crear nuevo usuario
        </Typography>
        
        <Box sx={{ position: "absolute", bottom: 16, left: 16 }}>
          <IconButton color="primary">
            <LanguageIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;