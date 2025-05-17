import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "../../Header/Header";

const Outing = () => {
  const [formData, setFormData] = useState({
    place: "",
    cost: "",
    numberOfDays: "",
    timestamp: localStorage?.getItem("selectedDate")
      ? localStorage?.getItem("selectedDate")
      : new Date().getTime(),
  });

  const [errors, setErrors] = useState({
    place: "",
    cost: "",
    numberOfDays: "",
  });

  const validate = () => {
    const newErrors = {
      place: "",
      cost: "",
      numberOfDays: "",
    };
    let valid = true;

    if (!formData.place.trim()) {
      newErrors.place = "Place is required";
      valid = false;
    }

    if (!formData.cost.trim() || isNaN(Number(formData.cost))) {
      newErrors.cost = "Valid cost is required";
      valid = false;
    }

    if (!formData.numberOfDays.trim() || isNaN(Number(formData.numberOfDays))) {
      newErrors.numberOfDays = "Valid number of days is required";
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
          "http://localhost:3002/user/raghav/outing",
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
            place: "",
            cost: "",
            numberOfDays: "",
          });
          alert("Outing saved successfully");
          console.log("Saved:", result);
        } else {
          alert("Error from server");
          console.error("Server error:", result.msg);
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
            Outing Entry
          </Typography>

          <TextField
            label="Place"
            name="place"
            value={formData.place}
            onChange={handleChange}
            variant="outlined"
            error={Boolean(errors.place)}
            helperText={errors.place}
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

          <TextField
            label="Number of Days"
            name="numberOfDays"
            value={formData.numberOfDays}
            onChange={handleChange}
            variant="outlined"
            error={Boolean(errors.numberOfDays)}
            helperText={errors.numberOfDays}
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

export default Outing;
