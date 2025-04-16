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

  // Guardar los cambios solo al hacer clic en "Guardar Cambios"
  const handleSave = () => {
    updateConfig({
      ...tempConfig,
      username: tempUsername,
      profilePic: tempProfilePic,
    });
  };

  // Actualizar el estado temporal sin afectar el config global
  const updateTempConfig = (key, value) => {
    setTempConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Box
      sx={{
        height: "100vh",
        overflowY: "auto", 
        bgcolor: config.mode === "Claro" ? "#FFFFFF" : "#333333", 
        padding: 2, 
        boxSizing: "border-box",
      }}
    >
      <Box
  className="config-container"
  sx={{
    maxWidth: "800px",
    margin: "0 auto",
    bgcolor: config.mode === "Oscuro" ? "rgba(66, 66, 66, 0.9)" : "rgba(255, 255, 255, 0.9)", // Gris oscuro o blanco
    color: config.mode === "Oscuro" ? "#FFFFFF" : "#333333", // Texto blanco o gris oscuro
  }}
>
        <Typography variant="h4" className="config-title">
          Configuración
        </Typography>

        {/* Sección General */}
        <Box className="config-section">
          <Typography variant="h6">General</Typography>
          <Box className="config-item">
            <Typography>Cambiar Modo</Typography>
            <Select
              value={tempConfig.mode}
              onChange={(e) => updateTempConfig("mode", e.target.value)}
              className="config-select"
            >
              <MenuItem value="Claro">Claro</MenuItem>
              <MenuItem value="Oscuro">Oscuro</MenuItem>
            </Select>
          </Box>
          <Box className="config-item">
            <Typography>Cambiar Background</Typography>
            <input
              type="color"
              value={tempConfig.backgroundColor}
              onChange={(e) => updateTempConfig("backgroundColor", e.target.value)}
            />
          </Box>
        </Box>

        {/* Sección Usuario */}
        <Box className="config-section">
          <Typography variant="h6">Usuario</Typography>
          <Box className="config-item" sx={{ flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography>Nombre de Usuario</Typography>
              <TextField
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                className="config-input"
                fullWidth
              />
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
              <Avatar src={tempProfilePic} sx={{ width: 80, height: 80 }} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
                id="upload-profile-pic"
              />
              <label htmlFor="upload-profile-pic">
                <Button variant="contained" component="span" sx={{ padding: '6px 12px', fontSize: '14px' }}>
                  Subir una imagen
                </Button>
              </label>
              <Button
                variant="outlined"
                onClick={() => setTempProfilePic(null)}
                sx={{ padding: '6px 12px', fontSize: '14px' }}
              >
                Eliminar imagen
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Sección Diseño de UI */}
        <Box className="config-section">
          <Typography variant="h6">Cambia Diseño de UI</Typography>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
            <Box className="config-item" sx={{ flex: 1 }}>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <input
                  type="color"
                  value={tempConfig.menuColor}
                  onChange={(e) => updateTempConfig("menuColor", e.target.value)}
                />
                <Typography>Menu</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <input
                  type="color"
                  value={tempConfig.eliminarChatColor}
                  onChange={(e) => updateTempConfig("eliminarChatColor", e.target.value)}
                />
                <Typography>Eliminar Chat</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <input
                  type="color"
                  value={tempConfig.subirImagenColor}
                  onChange={(e) => updateTempConfig("subirImagenColor", e.target.value)}
                />
                <Typography>Subir Imagen</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <input
                  type="color"
                  value={tempConfig.eliminarImagenColor}
                  onChange={(e) => updateTempConfig("eliminarImagenColor", e.target.value)}
                />
                <Typography>Eliminar Imagen</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <input
                  type="color"
                  value={tempConfig.nuevoChatColor}
                  onChange={(e) => updateTempConfig("nuevoChatColor", e.target.value)}
                />
                <Typography>Nuevo Chat</Typography>
              </Box>
            </Box>
            <Box className="config-item" sx={{ flex: 1 }}>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <input
                  type="color"
                  value={tempConfig.colorLateral}
                  onChange={(e) => updateTempConfig("colorLateral", e.target.value)}
                />
                <Typography>Color Lateral</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <input
                  type="color"
                  value={tempConfig.colorLateralFooter}
                  onChange={(e) => updateTempConfig("colorLateralFooter", e.target.value)}
                />
                <Typography>Color Lateral Footer</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <input
                  type="color"
                  value={tempConfig.colorMensChatIA}
                  onChange={(e) => updateTempConfig("colorMensChatIA", e.target.value)}
                />
                <Typography>Color Mens. Chat IA</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                <input
                  type="color"
                  value={tempConfig.colorMensChatUs}
                  onChange={(e) => updateTempConfig("colorMensChatUs", e.target.value)}
                />
                <Typography>Color Mens. Chat Us.</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="config-actions" sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3, mb: 2 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleSave}
            sx={{ padding: '6px 12px', fontSize: '14px' }}
          >
            Guardar Cambios
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setTempConfig({ ...config });
              setTempUsername(config.username);
              setTempProfilePic(config.profilePic);
            }}
            sx={{ padding: '6px 12px', fontSize: '14px' }}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ConfigPage;