import { useState } from "react";
import {
  TextField,
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

  const handleLogin = async (e) => {
    e.preventDefault();

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

        localStorage.setItem("loginStatus", true);
        localStorage.setItem("name", data?.user?.username);

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-200/80">
        <form onSubmit={handleLogin} className="flex flex-col">
          <h1 className="text-2xl font-extrabold text-slate-900 text-center tracking-tight">
            Login
          </h1>
          <p className="text-sm text-slate-500 text-center mt-1 mb-6">
            Enter your credentials to access your account
          </p>

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

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer flex items-center justify-center"
          >
            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "LOGIN"}
          </button>

          {status && (
            <div className="mt-5">
              <Alert severity={status} sx={{ borderRadius: 2 }}>
                {message}
              </Alert>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
