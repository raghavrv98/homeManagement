import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, Paper } from "@mui/material";
import Header from "../Header/Header";

const tabLabels = [
  "Vegetable and Fruits",
  "Milk",
  "Kirana Store",
  "FastFood",
  "Homeneeds",
  "Petrol",
  // "sex",
  // "hugs",
  // "kisses",
  "outing",
  // "coupleGames",
  "HouseRent",
  "WifiBill",
];

const Graphs = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <>
      <Header backLink={"/dashboard"} />
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Graphs
        </Typography>

        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>

        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6">{tabLabels[selectedTab]} Content</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {/* Replace below with actual content per tab */}
            This is the content area for{" "}
            <strong>{tabLabels[selectedTab]}</strong>.
          </Typography>
        </Paper>
      </Box>
    </>
  );
};

export default Graphs;
