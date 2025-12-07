import React from "react";
import { Button, Typography, Box } from "@mui/material";

/**
 * Reusable Error Page Component
 * Props:
 * - code: number (401, 404, 500, 502)...
 * - message: string (custom message)
 * - onRetry: function (optional retry handler)
 */

const ErrorPage = ({ code = 401, message, onRetry }) => {
  const defaultMessages = {
    401: "Unauthorized access. Please login with valid credentials",
    404: "Page not found",
    500: "Internal server error. We're sorry problem is at our end..",
    502: "Bad gateway",
  };

  const finalMessage = message || defaultMessages[code] || "Unexpected error";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 3,
      }}
    >
      <Typography variant="h2" fontWeight={700} gutterBottom>
        {code}
      </Typography>

      <Typography variant="h6" color="text.secondary" mb={3}>
        {finalMessage}
      </Typography>

      {onRetry && (
        <Button
          variant="contained"
          onClick={onRetry}
          sx={{ mt: 2, borderRadius: 2 }}
        >
          Retry
        </Button>
      )}
    </Box>
  );
};

export default ErrorPage;
