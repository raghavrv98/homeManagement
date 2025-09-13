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

const ElectricityBill = () => {
  const now = getCurrentDateTimeLocal();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    timestamp: now,
  });
  const [error, setError] = useState("");

  const validate = () => {
    if (!formData.amount.trim() || isNaN(Number(formData.amount))) {
      setError("Valid amount is required");
      return false;
    }
    setError("");
    return true;
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
        const response = await fetch(`${API_URL}/user/raghav/electricity`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: formData.amount,
            timestamp: new Date(formData.timestamp).getTime(),
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setFormData({
            amount: "",
            timestamp: getCurrentDateTimeLocal(),
          });
          alert("Data saved successfully");
          setLoading(false);
        } else {
          alert("Error from server");
          setLoading(false);
          console.error("Error from server:", result.msg);
        }
      } catch (error) {
        alert("Network error");
        setLoading(false);
        console.error("Network error:", error);
      }
    }
  };

  return (
    <>
      <Header backLink={"/home/money"} title="Electricity Bill" />
      <div className="container">
        <form className="form" onSubmit={handleSubmit}>
          <Typography variant="h5" align="center" gutterBottom>
            Electricity Bill Entry
          </Typography>

          <TextField
            label="Amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            variant="outlined"
            error={Boolean(error)}
            helperText={error}
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

export default ElectricityBill;
