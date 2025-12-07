import { useState } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { API_URL } from "../../constant";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({ username: "", password: "" });

  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // =============================
  // VALIDATION
  // =============================
  const validate = () => {
    let valid = true;
    const newErrors = { username: "", password: "" };

    if (!username.trim()) {
      newErrors.username = "User ID is required";
      valid = false;
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // =============================
  // LOGIN HANDLER (API CALL)
  // =============================
  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    setMessage(null);
    setStatus(null);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      setMessage(data.msg);

      if (res.status === 200) {
        setStatus("success");

        // store session data
        sessionStorage.setItem("loginStatus", true);
        sessionStorage.setItem("name", data?.user?.username);

        navigate("/dashboard");
      } else {
        setStatus("error");
      }
    } catch {
      setMessage("Something went wrong");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f3f4f6",
        p: 4,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 3,
          borderRadius: 4,
          boxShadow: 6,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight="600"
            gutterBottom
          >
            Login
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            mb={2}
          >
            Enter your credentials to access your account
          </Typography>

          {/* Username */}
          <TextField
            label="User ID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={Boolean(errors.username)}
            helperText={errors.username}
          />

          {/* Password */}
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={Boolean(errors.password)}
            helperText={errors.password}
          />

          {/* Login Button */}
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3, py: 1.4, borderRadius: 2 }}
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? <CircularProgress size={24} /> : "LOGIN"}
          </Button>

          {/* Status Message */}
          {status && (
            <Alert
              severity={status}
              sx={{ mt: 3, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {message}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
