import React, { useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";
import { Tabs, Tab, Box, Typography, Paper } from "@mui/material";
import Header from "../Header/Header.jsx";

const tabLabels = [
  "Vegetable and Fruits",
  "milk",
  "Kirana Store",
  "Fast Food",
  "Homeneeds",
  "Petrol",
  "outing",
  "House Rent",
  "Wifi Bill",
];

const DataTables = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [apiData, setApiData] = useState([]);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(true);
  const currentTab = tabLabels[selectedTab];

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://humlog.onrender.com/users/raghav");
        const result = await response.json();

        if (response.ok) {
          let newApiData = {
            "Vegetable and Fruits": result.data[0]?.money?.vegetablesFruits,
            "Kirana Store": result.data[0]?.money?.kiranaStore,
            "Fast Food": result.data[0]?.money?.fastFood,
            milk: result.data[0]?.money?.milk,
            Homeneeds: result.data[0]?.money?.homeNeeds,
            Petrol: result.data[0]?.money?.petrol,
            outing: result.data[0]?.money?.outing,
            "House Rent": result.data[0]?.money?.houseRent,
            "Wifi Bill": result.data[0]?.money?.wifi,
            Outing: result.data[0]?.money?.outing,
          };
          // Assuming your API returns an object where each key is a category (like 'Vegetable and Fruits', 'Milk', etc.)
          setApiData(newApiData);
          setLoading(false);
        } else {
          setApiError(result.msg || "Failed to fetch data");
        }
      } catch (error) {
        alert(apiError || error.message);
        console.error("Error fetching data:", error);
        setApiError("An error occurred: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loading]); // Empty dependency array to run the effect only once

  const data = useMemo(() => apiData[currentTab] || [], [apiData, currentTab]);

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    const keys = Object.keys(data[0]).filter((key) => key !== "_id");

    const formatTimestamp = (iso) => {
      const date = new Date(iso);
      const day = date.getDate();
      const month = date.toLocaleString("en-US", { month: "long" });
      const year = date.getFullYear();

      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "pm" : "am";

      hours = hours % 12 || 12;

      return `${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
    };

    return [
      {
        Header: "#",
        accessor: (row, i) => i + 1,
        id: "index",
      },
      ...keys.map((key) => ({
        Header: key.charAt(0).toUpperCase() + key.slice(1),
        accessor: (row) =>
          key === "timestamp" ? formatTimestamp(row[key]) : row[key],
        id: key,
      })),
    ];
  }, [data]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <>
      <Header backLink={"/dashboard"} />
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Data Tables
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

        <Paper sx={{ overflowX: "auto" }}>
          <table
            {...getTableProps()}
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "16px",
            }}
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      key={column.id}
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        background: "#f5f5f5",
                        textAlign: "left",
                      }}
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {loading ? (
                "Loading..."
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} style={{ padding: "12px" }}>
                    No data available
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} key={row.id}>
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          key={cell.column.id}
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                          }}
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </Paper>
      </Box>
    </>
  );
};

export default DataTables;
