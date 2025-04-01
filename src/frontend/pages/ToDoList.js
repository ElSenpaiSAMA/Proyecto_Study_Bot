import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const ToDoList = () => {
  return (
    <Box display="flex" height="100vh">
      <Box display="flex" flexDirection="column" flexGrow={1} bgcolor="#f5f5f5" p={3}>
        <Typography variant="h4" sx={{ fontStyle: "italic", borderBottom: "2px solid black", pb: 1 }}>
          To Do List
        </Typography>
        <Box display="flex" justifyContent="space-around" mt={2}>
          <TaskColumn title="To Do" color="red" tasks={3} />
          <TaskColumn title="Doing" color="blue" tasks={2} />
          <TaskColumn title="Done" color="green" tasks={2} />
        </Box>
      </Box>
    </Box>
  );
};

const TaskColumn = ({ title, color, tasks }) => (
  <Box display="flex" flexDirection="column" alignItems="center">
    <Typography variant="h6" sx={{ borderBottom: "1px solid black" }}>
      {title}
    </Typography>
    {[...Array(tasks)].map((_, index) => (
      <Paper
        key={index}
        sx={{
          width: 150,
          height: 30,
          my: 0.5,
          borderRadius: 15,
          borderLeft: `10px solid ${color}`,
          bgcolor: "lightgray",
        }}
      />
    ))}
  </Box>
);

export default ToDoList;
