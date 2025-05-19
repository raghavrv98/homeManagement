import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "../../Header/Header";

// Helper to format datetime-local string
const getCurrentDateTimeLocal = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

const HouseRent = () => {
  const now = getCurrentDateTimeLocal();

  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [timestamp, setTimestamp] = useState(now);
  const [error, setError] = useState("");

  const validate = () => {
    if (!amount.trim() || isNaN(Number(amount))) {
      setError("Valid amount is required");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setLoading(true);
      try {
        const response = await fetch(
          "https://humlog.onrender.com/user/raghav/houseRent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount,
              timestamp: new Date(timestamp).getTime(), // Convert to milliseconds
            }),
          }
        );

        const result = await response.json();

        if (response.ok) {
          setAmount("");
          setTimestamp(getCurrentDateTimeLocal());
          alert("Data saved successfully");
          setLoading(false);
          console.log("Data saved successfully:", result);
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
      <Header backLink={"/home/money"} />
      <div className="container">
        <form className="form" onSubmit={handleSubmit}>
          <Typography variant="h5" align="center" gutterBottom>
            House Rent Entry
          </Typography>

          <TextField
            label="Amount"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
            inputProps={{
              max: now, // Prevent future datetime
            }}
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

export default HouseRent;
