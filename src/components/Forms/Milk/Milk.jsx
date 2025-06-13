import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "../../Header/Header";
import { API_URL } from "../../../constant";

// Helper function to get formatted datetime-local
const getCurrentDateTimeLocal = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

const Milk = () => {
  const now = getCurrentDateTimeLocal();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brand: "",
    costWePaid: "",
    litre: "",
    mrp: "",
    timestamp: now,
  });

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
        const response = await fetch(`${API_URL}/user/raghav/milk`, {
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
            brand: "",
            costWePaid: "",
            litre: "",
            mrp: "",
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
      <Header backLink={"/home/money"} title="Milk" />
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

export default Milk;
