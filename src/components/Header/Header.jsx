import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

// const DateDisplay = () => {
//   const today = new Date();
//   const formattedDate = today.toLocaleDateString("en-US", {
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//   });
//   const formattedTime = today.toLocaleTimeString("en-US", {
//     hour: "numeric",
//     minute: "2-digit",
//     hour12: true,
//   });
//   return (
//     <div>
//       {formattedDate} - {formattedTime}
//     </div>
//   );
// };

const Header = ({ backLink, isShowBack = true, isShowLogout }) => {
  const navigate = useNavigate();

  // Format a Date object into "YYYY-MM-DDTHH:mm" format
  const formatDateForInput = (date) => {
    const pad = (n) => n.toString().padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Initialize state with value from localStorage or current date
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    localStorage.setItem("selectedDate", date.getTime().toString());
  }, [date]);

  const handleChange = (e) => {
    const newDate = new Date(e.target.value);
    setDate(newDate);
    localStorage.setItem("selectedDate", newDate.getTime().toString());
  };

  const handleBack = () => {
    if (backLink) {
      navigate(backLink);
    } else {
      navigate(-1); // default behavior
    }
  };

  const logoutHandler = () => {
    localStorage.clear();
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
        {/* <div className="time">
          <div>Date : </div>
          <DateDisplay />
        </div> */}
        <div className="time">
          <div>Select Date : </div>
          <input
            type="datetime-local"
            value={formatDateForInput(date)}
            onChange={handleChange}
          />
        </div>
        {isShowLogout && (
          <button className="back-button" onClick={logoutHandler}>
            {/* <div className="arrowIcon">
              < />
            </div> */}
            Logout
          </button>
        )}
      </div>
      <div className="title">
        <h1>Home Management</h1>
      </div>
    </header>
  );
};

export default Header;
