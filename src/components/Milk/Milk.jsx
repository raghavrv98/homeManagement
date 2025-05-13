import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "../Header/Header";

const Milk = () => {
  const [formData, setFormData] = useState({
    cost: "",
    packet: "",
  });

  const [errors, setErrors] = useState({
    cost: "",
    packet: "",
  });

  const validate = () => {
    const newErrors = {
      cost: "",
      packet: "",
    };
    let valid = true;

    if (!formData.cost.trim() || isNaN(Number(formData.cost))) {
      newErrors.cost = "Valid cost is required";
      valid = false;
    }

    if (!formData.packet.trim()) {
      newErrors.packet = "Packet info is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const response = await fetch("https://humlog.onrender.com/user/raghav/milk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          setFormData({
            cost: "",
            packet: "",
          });
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
            Milk Entry
          </Typography>

          <TextField
            label="Packet"
            name="packet"
            value={formData.packet}
            onChange={handleChange}
            variant="outlined"
            error={Boolean(errors.packet)}
            helperText={errors.packet}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            variant="outlined"
            error={Boolean(errors.cost)}
            helperText={errors.cost}
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

export default Milk;
