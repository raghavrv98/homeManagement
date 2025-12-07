import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "../../Header/Header";
import { API_URL } from "../../../constant";

const getCurrentDateTimeLocal = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

const VegetablesAndFruits = () => {
  const now = getCurrentDateTimeLocal();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    costPerKg: "",
    costWePaid: "",
    grams: "",
    timestamp: now,
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
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    formData["costPerKg"] = JSON.stringify(
      (formData.costWePaid / formData.grams) * 1000
    );
    if (validate()) {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/user/raghav/vegetablesFruits`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formData,
              timestamp: new Date(formData.timestamp).getTime(),
            }),
          }
        );

        const result = await response.json();

        if (response.ok) {
          setFormData({
            name: "",
            costPerKg: "",
            costWePaid: "",
            grams: "",
            timestamp: now,
          });
          alert("Data saved successfully");
          setLoading(false);
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
      <Header backLink={"/home/money"} title="Vegetable / Fruit Entry" />
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
            value={(formData.costWePaid / formData.grams) * 1000}
            // onChange={handleChange}
            variant="outlined"
            // error={Boolean(errors.costPerKg)}
            // helperText={errors.costPerKg}
            fullWidth
            disabled
            margin="normal"
          />

          <TextField
            label="Date & Time"
            type="datetime-local"
            name="timestamp"
            value={formData.timestamp}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
            inputProps={{ max: now }}
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

export default VegetablesAndFruits;
