import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "../Header/Header";

const FastFood = () => {
  const [formData, setFormData] = useState({
    name: "",
    cost: "",
    piecePlate: "",
    place: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    cost: "",
    piecePlate: "",
    place: "",
  });

  const validate = () => {
    const newErrors = {
      name: "",
      cost: "",
      piecePlate: "",
      place: "",
    };
    let valid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.cost.trim() || isNaN(Number(formData.cost))) {
      newErrors.cost = "Valid cost is required";
      valid = false;
    }

    if (!formData.piecePlate.trim()) {
      newErrors.piecePlate = "Piece/Plate info is required";
      valid = false;
    }

    if (!formData.place.trim()) {
      newErrors.place = "Place is required";
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
          "https://humlog.onrender.com/user/raghav/fastFood",
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
            cost: "",
            piecePlate: "",
            place: "",
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
            Fast Food Entry
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
            label="Piece/Plate"
            name="piecePlate"
            value={formData.piecePlate}
            onChange={handleChange}
            variant="outlined"
            error={Boolean(errors.piecePlate)}
            helperText={errors.piecePlate}
            fullWidth
            margin="normal"
          />

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

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Add
          </Button>
        </form>
      </div>
    </>
  );
};

export default FastFood;
