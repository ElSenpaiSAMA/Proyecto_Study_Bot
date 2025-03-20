import React, { useState } from "react";
import '../styles/ConfigPage.css'; 
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Avatar,
  TextField,
  InputLabel,
  FormControl,
} from "@mui/material";
import IAButton from "../components/IAButton"; 

const ConfigPage = () => {
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [menuColor, setMenuColor] = useState("#BDACD");
  const [eliminarChatColor, setEliminarChatColor] = useState("#FA5858");
  const [subirImagenColor, setSubirImagenColor] = useState("#64B297");
  const [eliminarImagenColor, setEliminarImagenColor] = useState("#D9D9D9");
  const [nuevoChatColor, setNuevoChatColor] = useState("#B0ADF9");
  const [colorLateral, setColorLateral] = useState("#64B297");
  const [colorLateralFooter, setColorLateralFooter] = useState("#588FA");
  const [colorBotonIA, setColorBotonIA] = useState("#64B297");
  const [colorMensChatIA, setColorMensChatIA] = useState("#BDACD");
  const [colorMensChatUs, setColorMensChatUs] = useState("#64B297");

  return (
    <Box display="flex" height="100vh" className="config-page">
      <Box flexGrow={1} p={3} className="config-container">
        <Typography variant="h4" className="config-title">
          Configuración
        </Typography>

        <Box className="config-section">
          <Typography variant="h6">General</Typography>
          <Box className="config-item">
            <Typography>Cambiar Idioma</Typography>
            <Select defaultValue="Español" className="config-select">
              <MenuItem value="Español">Español</MenuItem>
              <MenuItem value="Inglés">Inglés</MenuItem>
            </Select>
          </Box>
        </Box>

        <Box className="config-section">
          <Typography variant="h6">Usuario</Typography>
          <Box className="config-item" display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography>Nombre de Usuario</Typography>
              <TextField defaultValue="Josefina Sanchez" className="config-input" />
              <Button variant="contained" className="config-button">Cambiar</Button>
              <Button variant="outlined" className="config-button">Cancelar</Button>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar sx={{ width: 100, height: 100 }} />
              <Button variant="contained">Subir una imagen</Button>
              <Button variant="outlined">Eliminar imagen</Button>
            </Box>
          </Box>
          <Box className="config-item">
            <Button variant="contained" color="error">Cerrar Sesión</Button>
          </Box>
        </Box>

        <Box className="config-section">
          <Typography variant="h6">Cambia Diseño de UI</Typography>
          <Box className="config-item">
            <Typography>Cambiar Modo</Typography>
            <Select defaultValue="Claro" className="config-select">
              <MenuItem value="Claro">Claro</MenuItem>
              <MenuItem value="Oscuro">Oscuro</MenuItem>
            </Select>
          </Box>

          <Box className="config-item">
            <Typography>Cambiar Background</Typography>
            <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} />
            <Button variant="contained">Subir una imagen</Button>
            <Button variant="outlined">Eliminar Imagen</Button>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Box className="config-item" flex={1}>
              <Box display="flex" flexDirection="column" mt={1}>
                <Box display="flex" alignItems="center" mt={0.5}>
                  <input type="color" value={menuColor} onChange={(e) => setMenuColor(e.target.value)} />
                  <Typography>Menu</Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={0.5}>
                  <input type="color" value={eliminarChatColor} onChange={(e) => setEliminarChatColor(e.target.value)} />
                  <Typography>Eliminar Chat</Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={0.5}>
                  <input type="color" value={subirImagenColor} onChange={(e) => setSubirImagenColor(e.target.value)} />
                  <Typography>Subir Imagen</Typography>
                </Box>
                <Box display="flex" alignItems="center" mt={0.5}>
                  <input type="color" value={eliminarImagenColor} onChange={(e) => setEliminarImagenColor(e.target.value)} />
                  <Typography>Eliminar Imagen</Typography>
                </Box>
              </Box>
            </Box>

            <Box className="config-item" flex={1}>
              <Box display="flex" flexDirection="column">
                <Box display="flex" alignItems="center">
                  <input type="color" value={colorLateral} onChange={(e) => setColorLateral(e.target.value)} />
                  <Typography>Color Lateral</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <input type="color" value={colorLateralFooter} onChange={(e) => setColorLateralFooter(e.target.value)} />
                  <Typography>Color Lateral Footer</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <input type="color" value={colorBotonIA} onChange={(e) => setColorBotonIA(e.target.value)} />
                  <Typography>Color Botón IA</Typography>
                </Box>
                <IAButton color={colorBotonIA} />
                <Box display="flex" alignItems="center">
                  <input type="color" value={colorMensChatIA} onChange={(e) => setColorMensChatIA(e.target.value)} />
                  <Typography>Color Mens. Chat IA</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <input type="color" value={colorMensChatUs} onChange={(e) => setColorMensChatUs(e.target.value)} />
                  <Typography>Color Mens. Chat Us.</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="config-actions" display="flex" justifyContent="center" marginTop={3}>
          <Button variant="contained" color="success">Guardar Cambios</Button>
          <Button variant="outlined">Cancelar</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ConfigPage;
