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

const Outing = () => {
  const now = getCurrentDateTimeLocal();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    place: "",
    cost: "",
    numberOfDays: "",
    timestamp: now,
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
        const response = await fetch(`${API_URL}/user/raghav/outing`, {
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
            place: "",
            cost: "",
            numberOfDays: "",
            timestamp: now,
          });
          alert("Outing saved successfully");
          setLoading(false);
          console.log("Saved:", result);
        } else {
          alert("Error from server");
          setLoading(false);
          console.error("Server error:", result.msg);
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

export default Outing;
