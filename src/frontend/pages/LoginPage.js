import React, { useState } from "react";
import { Box, TextField, Button, Typography, IconButton, Snackbar, Alert } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import LanguageIcon from "@mui/icons-material/Language";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    // vaclidaciones básicas
    if (!name || !email || !password || !confirmPassword) { //si no hay alguna de estas variables, se cambia el valor de la variable error
      setError("Todos los campos son obligatórios.");
      return;
    }

    if (password !== confirmPassword) { //si las contraseñas son diferentes, se cambia el valor de la variable error
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 8) { //si la contraseña tiene menos de 8 caracteres, se cambia el valor de la variable error
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", { // llama al endpoint register
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar usuário.");
      }

      setSuccess("Usuário registrado con éxito!");
      setError("");
      // Limpar os campos após o registro
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Error al hacer login");
      }

      console.log("Login con éxito:", data);
      setError("");
      navigate("/tareas");
    } catch (err) {
      console.error("Error al hacer login:", err.message);       
    }
  };

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
      <Box
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: 400,
        }}
      >
        <Typography variant="h6" color="white" textAlign="center" gutterBottom>
          {isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}
        </Typography>

        {isSignUp && (
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Nombre de usuario"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{ style: { backgroundColor: "#fff" } }}
          />
        )}

        <TextField
          fullWidth
          margin="normal"
          variant="outlined"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{ style: { backgroundColor: "#fff" } }}
        />

        <TextField
          fullWidth
          margin="normal"
          variant="outlined"
          type="password"
          label="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{ style: { backgroundColor: "#fff" } }}
        />

        {isSignUp && (
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            type="password"
            label="Repetir contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{ style: { backgroundColor: "#fff" } }}
          />
        )}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={isSignUp ? handleRegister : handleLogin}
        >
          {isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}
        </Button>

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

        <Typography
          variant="body2"
          color="white"
          textAlign="center"
          sx={{ mt: 2, cursor: "pointer", textDecoration: "underline" }}
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "¿Ya tienes una cuenta? Inicia sesión" : "Crear nuevo usuario"}
        </Typography>

        <Box sx={{ position: "absolute", bottom: 16, left: 16 }}>
          <IconButton color="primary">
            <LanguageIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Feedback de éxito o error */}
      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={() => {
          setError("");
          setSuccess("");
        }}
      >
        <Alert
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default App;