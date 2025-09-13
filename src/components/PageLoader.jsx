import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const PageLoader = () => {
  return (
    <Box
      sx={{
        height: "100vh", // Full page height
        display: "flex", // Flexbox centering
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#F9FAFB", // Light background
      }}
    >
      <CircularProgress size={60} thickness={4} color="primary" />
      <Typography variant="subtitle1" sx={{ mt: 2, color: "text.secondary" }}>
        Loading, please wait...
      </Typography>
    </Box>
  );
};

export default PageLoader;
