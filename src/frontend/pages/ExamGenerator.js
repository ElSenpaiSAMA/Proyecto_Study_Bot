import React from "react";
import { Container, TextField, Button, Box, Typography, IconButton, Paper } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const ExamGenerator = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="h4" fontStyle="italic" gutterBottom>
        Generador de Examenes
      </Typography>
      <Box component={Paper} elevation={3} sx={{ p: 3, display: "flex", justifyContent: "center", alignItems: "center", height: 100 }}>
        <IconButton component="label">
          <CloudUploadIcon fontSize="large" />
          <input type="file" hidden />
        </IconButton>
      </Box>
      <Box display="flex" justifyContent="center" mt={3}>
        <Button variant="contained" sx={{ backgroundColor: "#3c8c74", "&:hover": { backgroundColor: "#326f5e" } }}>Generar Examen</Button>
      </Box>
      <Box component={Paper} elevation={3} sx={{ p: 3, mt: 3, height: 150 }}></Box>
    </Container>
  );
};

export default ExamGenerator;
