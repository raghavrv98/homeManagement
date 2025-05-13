import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "../Header/Header";

const VegetablesAndFruits = () => {
  const [formData, setFormData] = useState({
    name: "",
    costPerKg: "",
    grams: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    costPerKg: "",
    grams: "",
  });

  const validate = () => {
    const newErrors = {
      name: "",
      costPerKg: "",
      grams: "",
    };

    let valid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.costPerKg.trim() || isNaN(Number(formData.costPerKg))) {
      newErrors.costPerKg = "Valid cost per kg is required";
      valid = false;
    }

    if (!formData.grams.trim() || isNaN(Number(formData.grams))) {
      newErrors.grams = "Valid grams value is required";
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
        const response = await fetch(
          "https://humlog.onrender.com/user/raghav/vegetablesFruits",
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
            costPerKg: "",
            grams: "",
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
            Vegetable / Fruit Entry
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
            label="Grams"
            name="grams"
            value={formData.grams}
            onChange={handleChange}
            variant="outlined"
            error={Boolean(errors.grams)}
            helperText={errors.grams}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Cost per Kg"
            name="costPerKg"
            value={formData.costPerKg}
            onChange={handleChange}
            variant="outlined"
            error={Boolean(errors.costPerKg)}
            helperText={errors.costPerKg}
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

export default VegetablesAndFruits;
