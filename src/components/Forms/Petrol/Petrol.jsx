import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "../../Header/Header";
import { API_URL } from "../../../constant";

// Helper to get current date-time formatted for datetime-local input
const getCurrentDateTimeLocal = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

const Petrol = () => {
  const now = getCurrentDateTimeLocal();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    litre: "",
    kmDriven: "",
    cost: "",
    costPerLitre: "",
    timestamp: now,
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/user/raghav/petrol`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            timestamp: new Date(formData.timestamp).getTime(),
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setFormData({
            litre: "",
            kmDriven: "",
            cost: "",
            costPerLitre: "",
            timestamp: now,
          });
          alert("Data saved successfully");
          setLoading(false);
          console.log("Data saved successfully:", result);
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
      <Header backLink={"/home/money"} title="Petrol" />
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

export default Petrol;
