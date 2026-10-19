import React, { useState } from "react";
import Header from "../Header/Header";

const tabLabels = [
  "Vegetable and Fruits",
  "Milk",
  "Kirana Store",
  "FastFood",
  "Homeneeds",
  "Petrol",
  "Outing",
  "HouseRent",
  "WifiBill",
];

const Graphs = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header backLink={"/dashboard"} title="Graphs" />
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-4">
          Graphs
        </h1>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-thin">
          {tabLabels.map((label, index) => (
            <button
              key={index}
              onClick={() => setSelectedTab(index)}
              className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${
                selectedTab === index
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
          <h2 className="text-lg font-bold text-slate-800">
            {tabLabels[selectedTab]} Content
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            This is the content area for{" "}
            <strong className="text-slate-700">{tabLabels[selectedTab]}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Graphs;
