import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "../../Header/Header";

const Homeneeds = () => {
  const [formData, setFormData] = useState({
    name: "",
    piece: "",
    cost: "",
    timestamp: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    piece: "",
    cost: "",
  });

  const validate = () => {
    const newErrors = {
      name: "",
      piece: "",
      cost: "",
    };
    let valid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.piece.trim()) {
      newErrors.piece = "Piece info is required";
      valid = false;
    }

    if (!formData.cost.trim() || isNaN(Number(formData.cost))) {
      newErrors.cost = "Valid cost is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const timestamp = localStorage.getItem("selectedDate")
      ? parseInt(localStorage.getItem("selectedDate"), 10)
      : new Date().getTime();

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      timestamp, // this will always update with current or stored timestamp
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const response = await fetch(
          "https://humlog.onrender.com/user/raghav/homeNeeds",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const result = await response.json();

        if (response.ok) {
          setFormData({
            name: "",
            piece: "",
            cost: "",
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
            Homeneeds Entry
          </Typography>

          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            error={Boolean(errors.name)}
            helperText={errors.name}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Piece"
            name="piece"
            value={formData.piece}
            onChange={handleChange}
            variant="outlined"
            error={Boolean(errors.piece)}
            helperText={errors.piece}
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

export default Homeneeds;
