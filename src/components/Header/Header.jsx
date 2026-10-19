import React from "react";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

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
    <span>
      {formattedDate} - {formattedTime}
    </span>
  );
};

const Header = ({ backLink, isShowBack = true, title = "Home Management" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backLink) {
      navigate(backLink);
    } else {
      navigate(-1);
    }
  };

  const logoutHandler = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 flex-wrap gap-2.5">
        {isShowBack ? (
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 text-sm font-semibold transition-all hover:scale-105 cursor-pointer border border-slate-200/60 shadow-xs"
            onClick={handleBack}
          >
            <KeyboardBackspaceIcon sx={{ fontSize: 18 }} />
            Back
          </button>
        ) : (
          <div className="w-16" />
        )}

        <div className="hidden sm:block">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight text-center m-0">
            {title}
          </h1>
        </div>

        <div className="text-sm font-medium flex items-center gap-2 text-slate-600 bg-slate-100/70 px-3 py-1.5 rounded-xl border border-slate-200/50 backdrop-blur-xs">
          <span className="text-slate-500 font-semibold">Date :</span>
          <DateDisplay />
          <button
            className="ml-2 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all hover:scale-105 cursor-pointer border border-red-200/60"
            onClick={logoutHandler}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
