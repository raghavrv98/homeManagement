import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Box } from "@mui/material";

const DateDisplay = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const formattedTime = today.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return (
    <div>
      {formattedDate} - {formattedTime}
    </div>
  );
};

const Header = ({ backLink, isShowBack = true, title = "Home Management" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backLink) {
      navigate(backLink);
    } else {
      navigate(-1); // default behavior
    }
  };

  const logoutHandler = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="headerBackline">
        {isShowBack && (
          <button className="back-button" onClick={handleBack}>
            <div className="arrowIcon">
              <KeyboardBackspaceIcon />
            </div>
            Back
          </button>
        )}
        <Box
          className="title"
          sx={{
            display: {
              xs: "none", // hide on mobile
              sm: "block", // show on small and up
            },
          }}
        >
          <h1>{title}</h1>
        </Box>
        <div className="time">
          <div>Date : </div>
          <DateDisplay />
          <button className="back-button" onClick={logoutHandler}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
