import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "../../Header/Header";

const Petrol = () => {
  const [formData, setFormData] = useState({
    litre: "",
    kmDriven: "",
    cost: "",
    costPerLitre: "",
    timestamp: localStorage?.getItem("selectedDate")
      ? localStorage?.getItem("selectedDate")
      : new Date().getTime(),
  });

  const [errors, setErrors] = useState({
    litre: "",
    kmDriven: "",
    cost: "",
    costPerLitre: "",
  });

  const validate = () => {
    const newErrors = {
      litre: "",
      kmDriven: "",
      cost: "",
      costPerLitre: "",
    };
    let valid = true;

    if (!formData.litre.trim() || isNaN(Number(formData.litre))) {
      newErrors.litre = "Valid litre value is required";
      valid = false;
    }

    if (!formData.kmDriven.trim() || isNaN(Number(formData.kmDriven))) {
      newErrors.kmDriven = "Valid km driven is required";
      valid = false;
    }

    if (!formData.cost.trim() || isNaN(Number(formData.cost))) {
      newErrors.cost = "Valid cost is required";
      valid = false;
    }

    if (!formData.costPerLitre.trim() || isNaN(Number(formData.costPerLitre))) {
      newErrors.costPerLitre = "Valid cost per litre is required";
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
          "http://localhost:3002/user/raghav/petrol",
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
            litre: "",
            kmDriven: "",
            cost: "",
            costPerLitre: "",
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
            Petrol Entry
          </Typography>

          <TextField
            label="Litre"
            name="litre"
            value={formData.litre}
            onChange={handleChange}
            variant="outlined"
            error={Boolean(errors.litre)}
            helperText={errors.litre}
            fullWidth
            margin="normal"
          />

          <TextField
            label="KM Driven"
            name="kmDriven"
            value={formData.kmDriven}
            onChange={handleChange}
            variant="outlined"
            error={Boolean(errors.kmDriven)}
            helperText={errors.kmDriven}
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
            label="Cost per Litre"
            name="costPerLitre"
            value={formData.costPerLitre}
            onChange={handleChange}
            variant="outlined"
            error={Boolean(errors.costPerLitre)}
            helperText={errors.costPerLitre}
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

export default Petrol;
