import React from "react";
import Header from "../Header/Header.jsx";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <>
      <Header backLink={"/dashboard"} />
      <div className="flex flex-wrap gap-5 p-5 min-h-[80vh] justify-center items-center">
        <Button
          className="bg-slate-100 hover:bg-slate-200/80 p-5 rounded-2xl flex justify-center items-center h-48 shadow-md hover:shadow-lg transition-all w-full sm:w-[calc(50%-20px)] cursor-pointer text-slate-800 text-lg font-bold"
          component={Link}
          to="./money"
        >
          <div className="text-lg font-bold text-slate-800 text-center">Money</div>
        </Button>
      </div>
    </>
  );
};

export default Homepage;
