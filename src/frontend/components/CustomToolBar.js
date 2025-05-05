import { MenuItem, Select, IconButton, Box, useTheme, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight, Today } from "@mui/icons-material";
import {useState} from 'react';
import { format } from "date-fns";
import { es } from "date-fns/locale";

const CustomToolbar = ({ label, onNavigate, onView }) => {
    const theme = useTheme();
    const [currentDate, setCurrentDate] = useState(new Date());
  
    const handleMonthChange = (event) => {
      const newDate = new Date(currentDate);
      newDate.setMonth(event.target.value);
      setCurrentDate(newDate);
      onNavigate('DATE', newDate);
    };
  
    const handleYearChange = (event) => {
      const newDate = new Date(currentDate);
      newDate.setFullYear(event.target.value);
      setCurrentDate(newDate);
      onNavigate('DATE', newDate);
    };
  
    const navigate = (action) => {
      onNavigate(action);
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        if (action === 'PREV') newDate.setMonth(newDate.getMonth() - 1);
        if (action === 'NEXT') newDate.setMonth(newDate.getMonth() + 1);
        return newDate;
      });
    };
  
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        p: 2,
        backgroundColor: theme.palette.primary.main,
        borderRadius: '12px 12px 0 0',
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <IconButton onClick={() => navigate('TODAY')} sx={{ color: 'white' }}>
            <Today />
          </IconButton>
          
          <Select
            value={currentDate.getMonth()}
            onChange={handleMonthChange}
            variant="outlined"
            sx={{ 
              backgroundColor: 'white',
              borderRadius: '8px',
              '& .MuiSelect-select': { py: 1 }
            }}
          >
            {[...Array(12).keys()].map(month => (
              <MenuItem key={month} value={month}>
                {format(new Date(currentDate.getFullYear(), month), 'MMMM', { locale: es }).toUpperCase()}
              </MenuItem>
            ))}
          </Select>
  
          <Select
            value={currentDate.getFullYear()}
            onChange={handleYearChange}
            variant="outlined"
            sx={{ 
              backgroundColor: 'white',
              borderRadius: '8px',
              '& .MuiSelect-select': { py: 1 }
            }}
          >
            {[...Array(10).keys()].map(i => (
              <MenuItem key={i} value={currentDate.getFullYear() - 5 + i}>
                {currentDate.getFullYear() - 5 + i}
              </MenuItem>
            ))}
          </Select>
        </Box>
  
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {label.split(' ')[0].toUpperCase()}
        </Typography>
  
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => navigate('PREV')} sx={{ color: 'white' }}>
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={() => navigate('NEXT')} sx={{ color: 'white' }}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>
    );
  };

export default CustomToolbar;