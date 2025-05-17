import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "../../Header/Header";

const HouseRent = () => {
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
      const timestamp = localStorage?.getItem("selectedDate")
        ? localStorage?.getItem("selectedDate")
        : new Date().getTime();
      try {
        const response = await fetch(
          "http://localhost:3002/user/raghav/houseRent",
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
          console.log("Data saved successfully:", result);
          // Optionally navigate or show a success message
        } else {
          alert("Error from server");
          console.error("Error from server:", result.msg);
        }
      } catch (error) {
        alert("Network error");
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

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Add
          </Button>
        </form>
      </div>
    </>
  );
};

export default HouseRent;
