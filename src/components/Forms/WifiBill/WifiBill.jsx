import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "../../Header/Header";

const WifiBill = () => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
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
      const timestamp = localStorage?.getItem("selectedDate")
        ? localStorage?.getItem("selectedDate")
        : new Date().getTime();
      try {
        const response = await fetch(
          "https://humlog.onrender.com/user/raghav/wifi",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount, timestamp }),
          }
        );

        const result = await response.json();

        if (response.ok) {
          setAmount("");
          alert("Data saved successfully");
          setLoading(false);
          console.log("Data saved successfully:", result);
          // Optionally navigate or show a success message
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
            Wifi Bill Entry
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

export default WifiBill;
