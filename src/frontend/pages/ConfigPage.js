import React, { useState } from "react";
import '../styles/ConfigPage.css';
import { Box, Typography, Select, MenuItem, Button, Avatar, TextField } from "@mui/material";
import { useConfig } from '../context/ConfigContext';

const ConfigPage = () => {
  const { config, updateConfig } = useConfig();

  // Estado temporal para los cambios
  const [tempConfig, setTempConfig] = useState({ ...config });
  const [tempUsername, setTempUsername] = useState(config.username);
  const [tempProfilePic, setTempProfilePic] = useState(config.profilePic);

  // Manejar la subida de imagen
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTempProfilePic(imageUrl);
    }
  };

  // Guardar los cambios
  const handleSave = () => {
    updateConfig({
      ...tempConfig,
      username: tempUsername,
      profilePic: tempProfilePic,
    });
  };

  // Actualizar el estado temporal
  const updateTempConfig = (key, value) => {
    setTempConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Box
      sx={{
        height: "100vh",
        overflowY: "auto",
        bgcolor: config.mode === "Claro" ? "#f5f7fa" : "#1a1a1a",
        padding: 2,
        boxSizing: "border-box",
        transition: "background 0.5s ease",
      }}
    >
      <Box
        className="config-container"
        sx={{
          maxWidth: "800px",
          margin: "0 auto",
          '--bg-container': config.mode === "Oscuro" ? "rgba(34, 34, 34, 0.95)" : "rgba(255, 255, 255, 0.95)",
          '--text-color': config.mode === "Oscuro" ? "#FFFFFF" : "#333333",
          background: config.mode === "Oscuro" 
            ? "linear-gradient(135deg, rgba(34,34,34,0.95) 0%, rgba(50,50,50,0.98) 100%)" 
            : "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(245,245,245,0.98) 100%)",
          color: "var(--text-color)"
        }}
      >
        <Typography variant="h4" className="config-title">
          Configuración
        </Typography>

        {/* Sección General - Modo */}
        <Box className="config-section">
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Tema de la aplicación</Typography>
          <Box className="config-item" sx={{ justifyContent: 'space-between' }}>
            <Typography>Modo de interfaz</Typography>
            <Select
              value={tempConfig.mode}
              onChange={(e) => updateTempConfig("mode", e.target.value)}
              sx={{
                width: 200,
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(5px)",
                borderRadius: "10px",
                '& .MuiSelect-select': { padding: "10px" }
              }}
            >
              <MenuItem value="Claro">Claro</MenuItem>
              <MenuItem value="Oscuro">Oscuro</MenuItem>
            </Select>
          </Box>
        </Box>

        {/* Sección Perfil - Nueva distribución */}
        <Box className="config-section" sx={{ display: 'grid', gridTemplateColumns: { sm: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Perfil de usuario</Typography>
            <TextField
              label="Nombre de usuario"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.2)",
                }
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Avatar 
              src={tempProfilePic} 
              sx={{ 
                width: 100, 
                height: 100,
                boxShadow: 3,
                transition: "transform 0.3s",
                '&:hover': { transform: "scale(1.05)" }
              }} 
            />
            <input type="file" accept="image/*" onChange={handleImageUpload} hidden id="upload-profile-pic" />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <label htmlFor="upload-profile-pic">
                <Button 
                  variant="contained" 
                  component="span"
                  sx={{ 
                    borderRadius: "8px",
                    background: "linear-gradient(45deg, #4a90e2 30%, #36d1dc 90%)",
                    '&:hover': { boxShadow: 2 }
                  }}
                >
                  Cambiar foto
                </Button>
              </label>
              <Button
                variant="outlined"
                onClick={() => setTempProfilePic(null)}
                sx={{ 
                  borderRadius: "8px",
                  borderColor: 'divider',
                  '&:hover': { 
                    borderColor: 'text.secondary',
                    color: 'text.secondary',
                    bgcolor: 'action.hover' 
                  }
                }}
              >
                Eliminar
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Sección Colores - Distribución mejorada */}
        <Box className="config-section">
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Personalización de colores</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { sm: '1fr 1fr' }, gap: 3 }}>
            {/* Columna Izquierda */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box className="config-item">
                <Typography>Mensajes usuario</Typography>
                <input
                  type="color"
                  value={tempConfig.colorMensChatUs}
                  onChange={(e) => updateTempConfig("colorMensChatUs", e.target.value)}
                />
              </Box>
              <Box className="config-item">
                <Typography>Botones del menú</Typography>
                <input
                  type="color"
                  value={tempConfig.menuButtonColor}
                  onChange={(e) => updateTempConfig("menuButtonColor", e.target.value)}
                />
              </Box>
              <Box className="config-item">
                <Typography>Menu</Typography>
                <input
                  type="color"
                  value={tempConfig.colorLateral}
                  onChange={(e) => updateTempConfig("colorLateral", e.target.value)}
                />
              </Box>
            </Box>

            {/* Columna Derecha */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box className="config-item">
                <Typography>Mensajes IA</Typography>
                <input
                  type="color"
                  value={tempConfig.colorMensChatIA}
                  onChange={(e) => updateTempConfig("colorMensChatIA", e.target.value)}
                />
              </Box>
              <Box className="config-item">
                <Typography>Botones del menú (hover)</Typography>
                <input
                  type="color"
                  value={tempConfig.menuButtonHoverColor}
                  onChange={(e) => updateTempConfig("menuButtonHoverColor", e.target.value)}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Acciones finales - Estilo mejorado */}
        <Box className="config-actions" sx={{ mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              px: 4,
              py: 1,
              borderRadius: "8px",
              background: "linear-gradient(45deg, #4a90e2 30%, #36d1dc 90%)",
              '&:hover': { 
                transform: "translateY(-2px)",
                boxShadow: 3 
              }
            }}
          >
            Guardar cambios
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setTempConfig({ ...config });
              setTempUsername(config.username);
              setTempProfilePic(config.profilePic);
            }}
            sx={{
              px: 4,
              py: 1,
              borderRadius: "8px",
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': { 
                borderColor: 'text.secondary',
                color: 'text.secondary',
                bgcolor: 'rgba(0, 0, 0, 0.04)' 
              }
            }}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ConfigPage;