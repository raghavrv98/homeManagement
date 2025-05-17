import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import "./LoginForm.css";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ name: "", password: "" });
  const navigate = useNavigate();

  const validate = () => {
    let valid = true;
    const newErrors = { name: "", password: "" };

    if (!name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      navigate("/dashboard", { state: { name } });
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          error={Boolean(errors.name)}
          helperText={errors.name}
          fullWidth
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          error={Boolean(errors.password)}
          helperText={errors.password}
          fullWidth
        />

        <Button type="submit" variant="contained" fullWidth>
          Sign In
        </Button>
        <Typography
          variant="body2"
          align="center"
          style={{ marginTop: "10px" }}
        >
          Don't have an account? <a href="#">Sign Up</a>
        </Typography>
      </form>
    </div>
  );
};

export default LoginForm;
