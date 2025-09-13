import { Button, TextField, Typography } from "@mui/material";
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

const HomeLoan = () => {
  const now = getCurrentDateTimeLocal();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    policyNumber: "HOU/FBD/0322/970416", // Pre-filled
    bankName: "PNB", // Pre-filled
    cost: "23966",
    timestamp: now,
  });

  const [error, setError] = useState({
    cost: "",
  });

  const validate = () => {
    let valid = true;
    const newError = { cost: "" };

    if (!formData.cost.trim() || isNaN(Number(formData.cost))) {
      newError.cost = "Valid amount is required";
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
        const response = await fetch(`${API_URL}/user/raghav/homeloan`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            policyNumber: formData.policyNumber,
            bankName: formData.bankName,
            cost: Number(formData.cost),
            timestamp: new Date(formData.timestamp).getTime(),
          }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Home loan entry saved successfully");
          setFormData({
            policyNumber: "1111",
            bankName: "PNB",
            cost: "",
            timestamp: getCurrentDateTimeLocal(),
          });
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
      <Header backLink="/home/money" title="Home Loan Entry" />
      <div className="container">
        <form className="form" onSubmit={handleSubmit}>
          <Typography variant="h5" align="center" gutterBottom>
            Add Home Loan Entry
          </Typography>

          <TextField
            label="Policy Number"
            name="policyNumber"
            value={formData.policyNumber}
            variant="outlined"
            fullWidth
            margin="normal"
            disabled
          />

          <TextField
            label="Bank Name"
            name="bankName"
            value={formData.bankName}
            variant="outlined"
            fullWidth
            margin="normal"
            disabled
          />

          <TextField
            label="Loan Amount"
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

export default HomeLoan;
