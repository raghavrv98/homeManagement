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

// Updated policy data as array of objects
const policyData = [
  {
    policyNumber: "562593772",
    memberName: "Anil Agrawal",
    maturityDate: "2029-04-28",
    maturityAmount: 500000,
    cost: 22756,
  },

  {
    policyNumber: "563352254",
    memberName: "Anil Agrawal",
    maturityDate: "2028-05-28",
    maturityAmount: 500000,
    cost: 25059,
  },
  {
    policyNumber: "563740338",
    memberName: "Anil Agrawal",
    maturityDate: "2030-07-28",
    maturityAmount: 250000,
    cost: 6065,
  },
  {
    policyNumber: "239440278",
    memberName: "Anil Agrawal",
    maturityDate: "2042-04-28",
    maturityAmount: 1500000,
    cost: 80716,
  },
  {
    policyNumber: "399554054",
    memberName: "Anil Agrawal",
    maturityDate: "2029-08-31",
    maturityAmount: 165310,
    cost: 14825,
  },

  {
    policyNumber: "239437433",
    memberName: "Richa Agrawal",
    maturityDate: "2036-08-28",
    maturityAmount: 100000,
    cost: 6891,
  },
  {
    policyNumber: "244667475",
    memberName: "Richa Agrawal",
    maturityDate: "2050-04-01",
    maturityAmount: 1400000,
    cost: 50845,
  },
  {
    policyNumber: "244670482",
    memberName: "Richa Agrawal",
    maturityDate: "2046-04-01",
    maturityAmount: 500000,
    cost: 21417,
  },
  {
    policyNumber: "268751066",
    memberName: "Richa Agrawal",
    maturityDate: "2045-01-28",
    maturityAmount: 500000,
    cost: 25631,
  },

  {
    policyNumber: "248239147",
    memberName: "Raghav Agrawal",
    maturityDate: "2042-12-28",
    maturityAmount: 100000,
    cost: 4868,
  },

  {
    policyNumber: "227603061",
    memberName: "Raghav Agrawal",
    maturityDate: "2044-04-01",
    maturityAmount: 1200000,
    cost: 49697,
  },

  {
    policyNumber: "259324368",
    memberName: "Raghav Agrawal",
    maturityDate: "2044-04-01",
    maturityAmount: 1000000,
    cost: 50069,
  },

  {
    policyNumber: "A8655911",
    memberName: "Raghav Agrawal per year milega from 05 nov 2028",
    maturityDate: "2028-11-05",
    maturityAmount: 140000,
    cost: 102250,
  },
  {
    policyNumber: "229192088",
    memberName: "Nishtha Agrawal",
    maturityDate: "2036-05-28",
    maturityAmount: 700000,
    cost: 43979,
  },
  {
    policyNumber: "248239144",
    memberName: "Nishtha Agrawal",
    maturityDate: "2042-12-28",
    maturityAmount: 100000,
    cost: 4863,
  },
];

const LIC = () => {
  const now = getCurrentDateTimeLocal();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    policyNumber: "",
    cost: "",
    maturityDate: "",
    maturityAmount: "",
    timestamp: now,
    memberName: "",
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
      const selected = policyData.find((item) => item.policyNumber === value);
      if (selected) {
        setFormData((prev) => ({
          ...prev,
          policyNumber: selected.policyNumber,
          memberName: selected.memberName,
          maturityDate: selected.maturityDate,
          maturityAmount: selected.maturityAmount,
          cost: selected.cost?.toString() || "",
        }));
      }
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
            memberName: formData.memberName,
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
            memberName: "",
          });
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
              {policyData.map((policy) => (
                <MenuItem key={policy.policyNumber} value={policy.policyNumber}>
                  {policy.policyNumber} - {policy.memberName}
                </MenuItem>
              ))}
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
            label="Member Name"
            name="memberName"
            value={formData.memberName}
            variant="outlined"
            disabled
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
