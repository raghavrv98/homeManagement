import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "../../Header/Header";

const VegetablesAndFruits = () => {
  const [formData, setFormData] = useState({
    name: "",
    costPerKg: "",
    costWePaid: "",
    grams: "",
    timestamp: localStorage?.getItem("selectedDate")
      ? localStorage?.getItem("selectedDate")
      : new Date().getTime(),
  });

  const [errors, setErrors] = useState({
    name: "",
    costPerKg: "",
    costWePaid: "",
    grams: "",
  });

  const validate = () => {
    const newErrors = {
      name: "",
      costPerKg: "",
      costWePaid: "",
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

    if (!formData.costWePaid.trim() || isNaN(Number(formData.costWePaid))) {
      newErrors.costWePaid = "Valid cost paid is required";
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
    console.log("formData: ", formData);
    e.preventDefault();

    if (validate()) {
      try {
        const response = await fetch(
          "http://localhost:3002/user/raghav/vegetablesFruits",
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
            costWePaid: "",
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
            label="Cost we paid"
            name="costWePaid"
            value={formData.costWePaid}
            onChange={handleChange}
            variant="outlined"
            error={Boolean(errors.costWePaid)}
            helperText={errors.costWePaid}
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
