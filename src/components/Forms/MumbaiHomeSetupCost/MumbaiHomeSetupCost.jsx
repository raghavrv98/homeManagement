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

const MumbaiHomeSetupCost = () => {
  const now = getCurrentDateTimeLocal();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    cost: "",
    place: "",
    howOld: "",
    timestamp: now,
  });

  const [error, setError] = useState({
    name: "",
    cost: "",
  });

  const validate = () => {
    let valid = true;
    const newError = { name: "", cost: "" };

    if (!formData.name.trim()) {
      newError.name = "Name is required";
      valid = false;
    }

    if (!formData.cost.trim() || isNaN(Number(formData.cost))) {
      newError.cost = "Valid amount is required";
      valid = false;
    }

    setError(newError);
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
        const response = await fetch(
          `${API_URL}/user/raghav/mumbaiHomeSetupCost`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
              cost: Number(formData.cost),
              place: formData.place,
              howOld: formData.howOld,
              timestamp: new Date(formData.timestamp).getTime(),
            }),
          }
        );

        const result = await response.json();

        if (response.ok) {
          alert("Mumbai Home Setup Cost entry saved successfully");
          setFormData({
            name: "",
            cost: "",
            place: "",
            howOld: "",
            timestamp: getCurrentDateTimeLocal(),
          });
          console.log("Saved:", result);
        } else {
          alert("Server error");
          console.error("Server error:", result.msg);
        }
      } catch (error) {
        alert("Network error");
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Header backLink="/home/money" title="Mumbai Home Setup Cost Entry" />
      <div className="container">
        <form className="form" onSubmit={handleSubmit}>
          <Typography variant="h5" align="center" gutterBottom>
            Mumbai Home Setup Cost Entry
          </Typography>

          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            error={Boolean(error.name)}
            helperText={error.name}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Amount"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            variant="outlined"
            error={Boolean(error.cost)}
            helperText={error.cost}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Place (optional)"
            name="place"
            value={formData.place}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />

          <TextField
            label="How Old (optional)"
            name="howOld"
            value={formData.howOld}
            onChange={handleChange}
            variant="outlined"
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

export default MumbaiHomeSetupCost;
