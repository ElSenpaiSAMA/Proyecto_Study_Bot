import React, { useState } from "react";
import { Box, TextField, Button, Typography, IconButton } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import LanguageIcon from "@mui/icons-material/Language";

const App = () => {
  // Estado para alternar entre la vista de inicio de sesión y la de registro
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: "url('/background.jpg')", // Imagen de fondo
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box 
        sx={{ 
          backgroundColor: "rgba(0, 0, 0, 0.6)", // Fondo semitransparente
          p: 4, 
          borderRadius: 2, 
          boxShadow: 3, 
          width: 400 
        }}
      >
        {/* Título dinámico según el estado actual */}
        <Typography variant="h6" color="white" textAlign="center" gutterBottom>
          {isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}
        </Typography>
        
        {/* Campo adicional solo si el usuario está en la vista de registro */}
        {isSignUp && (
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Nombre de usuario"
            InputProps={{ style: { backgroundColor: "#fff" } }}
          />
        )}
        
        {/* Campos comunes para ambos formularios */}
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
        
        {/* Campo de repetir contraseña solo en la vista de registro */}
        {isSignUp && (
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            type="password"
            label="Repetir contraseña"
            InputProps={{ style: { backgroundColor: "#fff" } }}
          />
        )}
        
        {/* Botón dinámico para enviar el formulario según la vista */}
        <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
          {isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}
        </Button>
        
        {/* Opción de inicio de sesión con Google, solo disponible en la vista de inicio de sesión */}
        {!isSignUp && (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{ mt: 2, backgroundColor: "white" }}
          >
            Iniciar Sesión con Google
          </Button>
        )}
        
        {/* Enlace para cambiar entre las vistas de inicio de sesión y registro */}
        <Typography
          variant="body2"
          color="white"
          textAlign="center"
          sx={{ mt: 2, cursor: "pointer", textDecoration: "underline" }}
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "¿Ya tienes una cuenta? Inicia sesión" : "Crear nuevo usuario"}
        </Typography>
        
        {/* Icono para selección de idioma */}
        <Box sx={{ position: "absolute", bottom: 16, left: 16 }}>
          <IconButton color="primary">
            <LanguageIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default App;