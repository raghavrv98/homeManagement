import {
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import React, { useState } from "react";
import Header from "../../Header/Header";
import { API_URL } from "../../../constant";

const getCurrentDateTimeLocal = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

const investmentTypes = ["SIP", "Mutual Fund", "RD", "Stocks"];

const Investment = () => {
  const now = getCurrentDateTimeLocal();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    cost: "",
    timestamp: now,
  });
  const [error, setError] = useState({
    type: "",
    cost: "",
  });

  const validate = () => {
    let valid = true;
    const newError = { type: "", cost: "" };

    if (!formData.type.trim()) {
      newError.type = "Investment type is required";
      valid = false;
    }

    if (!formData.cost.trim() || isNaN(Number(formData.cost))) {
      newError.cost = "Valid cost is required";
      valid = false;
    }

    setError(newError);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/user/raghav/investment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: formData.type,
            cost: Number(formData.cost),
            timestamp: new Date(formData.timestamp).getTime(),
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setFormData({
            type: "",
            cost: "",
            timestamp: getCurrentDateTimeLocal(),
          });
          alert("Investment saved successfully");
          console.log("Saved:", result);
        } else {
          alert("Server error");
          console.error("Server error:", result.msg);
        }
      } catch (error) {
        alert("Network error");
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Header backLink="/home/money" title="Add Investment" />
      <div className="container">
        <form className="form" onSubmit={handleSubmit}>
          <Typography variant="h5" align="center" gutterBottom>
            Investment Entry
          </Typography>

          <FormControl fullWidth margin="normal" error={Boolean(error.type)}>
            <InputLabel id="type-label">Investment Type</InputLabel>
            <Select
              labelId="type-label"
              name="type"
              value={formData.type}
              onChange={handleChange}
              label="Investment Type"
            >
              {investmentTypes.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{error.type}</FormHelperText>
          </FormControl>

          <TextField
            label="Cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            variant="outlined"
            error={Boolean(error.cost)}
            helperText={error.cost}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Date & Time"
            type="datetime-local"
            name="timestamp"
            value={formData.timestamp}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
            inputProps={{ max: now }}
          />

          <Button
            disabled={loading}
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            {loading ? "Loading..." : "Add"}
          </Button>
        </form>
      </div>
    </>
  );
};

export default Investment;
