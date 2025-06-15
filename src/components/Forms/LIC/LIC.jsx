import {
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
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

// Dummy data for policy details
const policyData = {
  A8655911: { maturityDate: "2030-12-31", maturityAmount: 100000 },
  227603061: { maturityDate: "2032-06-15", maturityAmount: 200000 },
  259324368: { maturityDate: "2029-08-01", maturityAmount: 150000 },
};

const LIC = () => {
  const now = getCurrentDateTimeLocal();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    policyNumber: "",
    cost: "",
    maturityDate: "",
    maturityAmount: "",
    timestamp: now,
  });

  const [error, setError] = useState({
    policyNumber: "",
    cost: "",
  });

  const validate = () => {
    let valid = true;
    const newError = { policyNumber: "", cost: "" };

    if (!formData.policyNumber) {
      newError.policyNumber = "Policy number is required";
      valid = false;
    }

    if (!formData.cost.trim() || isNaN(Number(formData.cost))) {
      newError.cost = "Valid premium amount is required";
      valid = false;
    }

    setError(newError);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "policyNumber") {
      const selected = policyData[value];
      setFormData((prev) => ({
        ...prev,
        policyNumber: value,
        maturityDate: selected.maturityDate,
        maturityAmount: selected.maturityAmount,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/user/raghav/lic`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            policyNumber: formData.policyNumber,
            cost: Number(formData.cost),
            maturityDate: new Date(formData.maturityDate).getTime(),
            maturityAmount: Number(formData.maturityAmount),
            timestamp: new Date(formData.timestamp).getTime(),
          }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("LIC entry saved successfully");
          setFormData({
            policyNumber: "",
            cost: "",
            maturityDate: "",
            maturityAmount: "",
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
      <Header backLink="/home/money" title="LIC Entry" />
      <div className="container">
        <form className="form" onSubmit={handleSubmit}>
          <Typography variant="h5" align="center" gutterBottom>
            Add LIC Premium Entry
          </Typography>

          <FormControl
            fullWidth
            margin="normal"
            error={Boolean(error.policyNumber)}
          >
            <InputLabel id="policy-label">Policy Number</InputLabel>
            <Select
              labelId="policy-label"
              name="policyNumber"
              value={formData.policyNumber}
              onChange={handleChange}
              label="Policy Number"
            >
              <MenuItem value="A8655911">A8655911 - ICICI</MenuItem>
              <MenuItem value="227603061">227603061 - LIC</MenuItem>
              <MenuItem value="259324368">259324368 - LIC</MenuItem>
            </Select>
            <FormHelperText>{error.policyNumber}</FormHelperText>
          </FormControl>

          <TextField
            label="Premium Amount"
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
            label="Maturity Date"
            name="maturityDate"
            value={formData.maturityDate}
            disabled
            variant="outlined"
            fullWidth
            margin="normal"
          />

          <TextField
            label="Maturity Amount"
            name="maturityAmount"
            value={formData.maturityAmount}
            disabled
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

export default LIC;
