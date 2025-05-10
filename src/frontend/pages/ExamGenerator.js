import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  IconButton,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
  useTheme, // Adicionado para theming
  styled // Adicionado para estilos customizados
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import { lighten } from "@mui/system"; // Para manipulação de cores

// Estilos customizados usando styled
const DropZone = styled(Box)(({ theme, dragOver }) => ({
  padding: theme.spacing(4),
  border: `2px dashed ${dragOver ? theme.palette.primary.main : theme.palette.divider}`,
  backgroundColor: dragOver ? lighten(theme.palette.primary.light, 0.9) : theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: lighten(theme.palette.primary.light, 0.95)
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: "2px",
    fontFamily: "'Fira Code', monospace",
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderRadius: "2px",
  },
}));

const ExamGenerator = () => {
  const theme = useTheme();
  const [file, setFile] = useState(null);
  const [examText, setExamText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    setFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleGenerate = async () => {
    if (!file) {
      setSnackbar({ open: true, message: "Por favor, sube un archivo primero." });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setExamText("");
    setAnswerText("");

    try {
      const response = await fetch("http://localhost:5000/exam_generator", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Error al generar el examen.");
      const data = await response.json();
      setExamText(data.exam);
    } catch (error) {
      setSnackbar({ open: true, message: "Error: " + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerGenerate = async () => {
    if (!file || !examText) {
      setSnackbar({ open: true, message: "Primero genera el examen o edítalo." });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("exam_text", examText);
    setLoading(true);
    setAnswerText("");

    try {
      const response = await fetch("http://localhost:5000/answer_generator", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Error al generar las respuestas.");
      const data = await response.json();
      setAnswerText(data.answers);
    } catch (error) {
      setSnackbar({ open: true, message: "Error: " + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="100%" sx={{ 
      mt: 4,
      p: 2,
      height: "calc(100vh - 64px)",
      [theme.breakpoints.down('md')]: { // Responsividade
        p: 0
      }
    }}>
      <Grid container sx={{
        height: "100%",
        boxShadow: theme.shadows[3],
        borderRadius: "2px",
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`
      }}>
        {/* Coluna esquerda */}
        <Grid item xs={10} md={2} sx={{
          borderRight: `1px solid ${theme.palette.divider}`,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 3,
          bgcolor: theme.palette.background.default
        }}>
          <DropZone 
            dragOver={dragOver}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <IconButton component="label" color="primary">
              <CloudUploadIcon fontSize="large" />
              <input type="file" hidden onChange={handleFileChange} />
            </IconButton>
            <Typography variant="body2" mt={1} color="text.secondary">
              {file ? (
                <Box display="flex" alignItems="center">
                  <FilePresentIcon fontSize="small" sx={{ mr: 1, color: theme.palette.success.main }} />
                  <Typography noWrap>{file.name}</Typography>
                </Box>
              ) : (
                "Arrastra un archivo o haz clic"
              )}
            </Typography>
          </DropZone>

          <Button
            variant="contained"
            fullWidth
            onClick={handleGenerate}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              py: 1.5,
              textTransform: "none",
              fontSize: "1rem"
            }}
          >
            Generar Examen
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            onClick={handleAnswerGenerate}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              py: 1.5,
              textTransform: "none",
              fontSize: "1rem",
              borderWidth: 2,
              '&:hover': { borderWidth: 2 }
            }}
          >
            Generar Respuestas
          </Button>
        </Grid>

        {/* Coluna central com scroll mais largo */}
          <Grid item xs={12} md={6} sx={{
            borderRight: `1px solid ${theme.palette.divider}`,
            p: 3,
            display: "flex",
            flexDirection: "column",
            bgcolor: theme.palette.background.paper,
            height: "100%",
            overflow: "hidden"
          }}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 600,
              color: theme.palette.text.primary
            }}>
              Examen Generado
            </Typography>
            
            <Box sx={{
              flex: 1,
              position: 'relative',  // Importante para o absolute do TextField
              minHeight: 0          // Corrige problemas de flexbox
            }}>
              <StyledTextField
                value={examText}
                onChange={(e) => setExamText(e.target.value)}
                multiline
                fullWidth
                variant="outlined"
                sx={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    height: '100%',
                    alignItems: 'flex-start',
                  },
                  '& textarea': {
                    height: '100% !important',
                    overflow: 'auto !important',
                  }
                }}
                InputProps={{
                  sx: {
                    height: '100%',
                    '& textarea': {
                      scrollbarWidth: 'thin',
                      scrollbarColor: `${theme.palette.primary.light} ${theme.palette.grey[100]}`,
                      '&::-webkit-scrollbar': {
                        width: '12px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: theme.palette.grey[100],
                        borderRadius: '6px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: '6px',
                        border: `2px solid ${theme.palette.grey[100]}`,
                      },
                    }, borderRadius: "20px",
                  }
                }}
              />
            </Box>
          </Grid>

          {/* Coluna direita com scroll corrigido */}
          <Grid item xs={12} md={4} sx={{
            p: 3,
            bgcolor: theme.palette.grey[50],
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden"
          }}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 2
            }}>
              Respuestas
            </Typography>
            
            <Box sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "2px",
              bgcolor: "white",
              overflow: "hidden" // Adicionado aqui
            }}>
              <Box sx={{
                flex: 1,
                overflowY: "auto", // Alterado para overflowY específico
                p: 2,
                '&::-webkit-scrollbar': {
                  width: '12px',
                },
                '&::-webkit-scrollbar-track': {
                  background: theme.palette.grey[100],
                  borderRadius: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '6px',
                  border: `2px solid ${theme.palette.grey[100]}`,
                },
                '&::-webkit-scrollbar-button:vertical:start': {
                  backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodeURIComponent(theme.palette.primary.main)}'><path d='M7 14l5-5 5 5z'/></svg>")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                },
                '&::-webkit-scrollbar-button:vertical:end': {
                  backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodeURIComponent(theme.palette.primary.main)}'><path d='M7 10l5 5 5-5z'/></svg>")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }
              }}>
                {answerText ? (
                  <Box component="pre" sx={{
                    whiteSpace: "pre-wrap",
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                    m: 0,
                    p: 1,
                    minHeight: '100%'
                  }}>
                    {answerText}
                  </Box>
                ) : (
                  <Box sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>


      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
        sx={{
          '& .MuiPaper-root': {
            bgcolor: theme.palette.mode === 'dark' ? '#333' : '#fff',
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[3]
          }
        }}
      />
    </Container>
  );
};

export default ExamGenerator;
