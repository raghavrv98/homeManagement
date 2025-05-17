import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "../../Header/Header";

const Milk = () => {
  const [formData, setFormData] = useState({
    brand: "",
    costWePaid: "",
    litre: "",
    mrp: "",
    timestamp: "",
  });

  console.log("formData: ", formData);

  const [errors, setErrors] = useState({
    brand: "",
    costWePaid: "",
    litre: "",
    mrp: "",
  });

  const validate = () => {
    const newErrors = {
      brand: "",
      costWePaid: "",
      litre: "",
      mrp: "",
    };
    let valid = true;

    if (!formData.brand.trim()) {
      newErrors.brand = "Brand is required";
      valid = false;
    }

    if (!formData.costWePaid.trim() || isNaN(Number(formData.costWePaid))) {
      newErrors.costWePaid = "Valid cost is required";
      valid = false;
    }

    if (!formData.litre.trim() || isNaN(Number(formData.litre))) {
      newErrors.litre = "Valid litre value is required";
      valid = false;
    }

    if (!formData.mrp.trim() || isNaN(Number(formData.mrp))) {
      newErrors.mrp = "Valid MRP is required";
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
            brand: "",
            costWePaid: "",
            litre: "",
            mrp: "",
          });
          alert("Data saved successfully");
          console.log("Data saved successfully:", result);
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
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            variant="outlined"
            error={Boolean(errors.brand)}
            helperText={errors.brand}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Cost We Paid"
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
            label="MRP"
            name="mrp"
            value={formData.mrp}
            onChange={handleChange}
            variant="outlined"
            error={Boolean(errors.mrp)}
            helperText={errors.mrp}
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
