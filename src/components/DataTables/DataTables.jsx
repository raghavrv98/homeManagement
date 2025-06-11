import React, { useEffect, useMemo, useState } from "react";
import { useSortBy, useTable } from "react-table";
import { Tabs, Tab, Box, Paper, Button, TextField } from "@mui/material";
import Header from "../Header/Header.jsx";
import { API_URL } from "../../constant.js";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

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
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editedData, setEditedData] = useState({});
  const currentTab = tabLabels[selectedTab];
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/users/raghav`);
        const result = await response.json();
        if (response.ok) {
          const newApiData = {
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
            // Assuming your API returns an object where each key is a category (like 'Vegetable and Fruits', 'Milk', etc.)
          };
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
  }, [apiError, loading]);
  const data = useMemo(() => {
    const raw = apiData[currentTab] || [];

    if (!startDate && !endDate) return raw;

    return raw.filter((item) => {
      const itemDate = dayjs(item.timestamp);

      if (!itemDate.isValid()) return false;

      const isAfterStart = startDate
        ? itemDate.isSameOrAfter(dayjs(startDate).startOf("day"))
        : true;

      const isBeforeEnd = endDate
        ? itemDate.isSameOrBefore(dayjs(endDate).endOf("day"))
        : true;

      return isAfterStart && isBeforeEnd;
    });
  }, [apiData, currentTab, startDate, endDate]);

  const handleEdit = (index) => {
    setEditingRowIndex(index);
    setEditedData({ ...data[index] });
  };

  const handleCancel = () => {
    setEditingRowIndex(null);
    setEditedData({});
  };

  const handleSave = () => {
    console.log("Saving row:", editedData);
    setEditingRowIndex(null);
    setEditedData({});
    // TODO: Add actual save logic (API call)
  };

  const handleDelete = (index) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (confirm) {
      console.log("Deleting row:", data[index]);
      // TODO: Add actual delete logic (API call)
    }
  };

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

  const columns = useMemo(() => {
    if (!data.length) return [];

    const keys = Object.keys(data[0]).filter((key) => key !== "_id");

    return [
      {
        Header: "#",
        accessor: (_, i) => i + 1,
        id: "index",
      },
      ...keys.map((key) => ({
        Header: key.charAt(0).toUpperCase() + key.slice(1),
        accessor: key,
        id: key,
        Cell: ({ row }) => {
          const i = row.index;
          if (editingRowIndex === i) {
            return (
              <TextField
                value={editedData[key]}
                onChange={(e) =>
                  setEditedData((prev) => ({
                    ...prev,
                    [key]: e.target.value,
                  }))
                }
                size="small"
              />
            );
          }

          return key === "timestamp"
            ? formatTimestamp(row.original[key])
            : row.original[key];
        },
      })),
      {
        Header: "Actions",
        id: "actions",
        Cell: ({ row }) => {
          const i = row.index;
          return editingRowIndex === i ? (
            <div style={{ display: "flex", gap: "6px" }}>
              <Button size="small" onClick={handleSave}>
                Save
              </Button>
              <Button size="small" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "6px" }}>
              <Button
                size="small"
                onClick={() => handleEdit(i)}
                variant="outlined"
              >
                Edit
              </Button>
              <Button
                size="small"
                onClick={() => handleDelete(i)}
                color="error"
                variant="outlined"
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ];
  }, [data, editedData, editingRowIndex]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState: {
          sortBy: [
            {
              id: "timestamp", // must match the column's `id`
              desc: true, // descending order
            },
          ],
        },
      },
      useSortBy
    );
  const totals = useMemo(() => {
    const total = {};
    if (data.length === 0) return total;

    Object.keys(data[0]).forEach((key) => {
      total[key] = data.reduce((sum, item) => {
        const val = item[key];
        return typeof val === "number" ? sum + val : "";
      }, 0);
    });

    return total;
  }, [data]);
  return (
    <>
      <Header backLink={"/dashboard"} />
      <Box p={3}>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          {tabLabels.map((label, idx) => (
            <Tab key={idx} label={label} />
          ))}
        </Tabs>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box display="flex" gap={2} mt={2}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              format="DD/MM/YYYY"
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              format="DD/MM/YYYY"
            />
            <Button
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
              }}
            >
              Clear Filter
            </Button>
          </Box>
        </LocalizationProvider>

        <Paper sx={{ mt: 3, overflowX: "auto", height: "75vh" }}>
          <table
            {...getTableProps()}
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.id}
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      background: "#e8f5e9",
                      fontWeight: "bold",
                      position: "sticky",
                      top: 0,
                      zIndex: 2, // Higher than header
                    }}
                  >
                    {column.id === "index"
                      ? "Total"
                      : typeof totals[column.id] === "number"
                      ? totals[column.id]
                      : ""}
                  </th>
                ))}
              </tr>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={column.id}
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        background: "#f5f5f5",
                        cursor: "pointer",
                      }}
                    >
                      {column.render("Header")}
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {loading ? (
                <tr>
                  <td colSpan={columns.length}>Loading...</td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length}>No data</td>
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
