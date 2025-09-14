import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSortBy, useTable } from "react-table";
import {
  Tabs,
  Tab,
  Box,
  Paper,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
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
  "Total",
  "Vegetable and Fruits",
  "milk",
  "Kirana Store",
  "Fast Food",
  "Homeneeds",
  "Petrol",
  "outing",
  "House Rent",
  "Wifi Bill",
  "Electricity Bill",
  "Gas Bill",
  "homeloan",
  "income",
  "investment",
  "lic",
  "parents",
  "Personal Expense",
  "Advitya Flat Cost",
  "Mumbai Home Setup Cost",
  "Cred Loan Repay",
  "Mumbai Misc",
  "Faridabad Misc",
];

const DataTables = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedTab, setSelectedTab] = useState(0);
  const [apiData, setApiData] = useState([]);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editedData, setEditedData] = useState({});
  const currentTab = tabLabels[selectedTab];
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());

  const saveData = useRef({ ...editedData });

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
          "Electricity Bill": result.data[0]?.money?.electricity,
          "Gas Bill": result.data[0]?.money?.gas,
          homeloan: result.data[0]?.money?.homeloan,
          income: result.data[0]?.money?.income,
          investment: result.data[0]?.money?.investment,
          lic: result.data[0]?.money?.lic,
          parents: result.data[0]?.money?.parents,
          "Personal Expense": result.data[0]?.money?.personalExpense,
          "Advitya Flat Cost": result.data[0]?.money?.advityaFlatCost,
          "Mumbai Home Setup Cost": result.data[0]?.money?.mumbaiHomeSetupCost,
          "Cred Loan Repay": result.data[0]?.money?.credLoanRepay,
          "Mumbai Misc": result.data[0]?.money?.mumbaiMisc,
          "Faridabad Misc": result.data[0]?.money?.faridabadMisc,
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

  useEffect(() => {
    fetchData();
  }, [apiError, loading]);

  const data = useMemo(() => {
    if (!apiData) return [];

    let raw = [];

    if (currentTab === "Total") {
      Object.values(apiData).forEach((arr) => {
        if (Array.isArray(arr)) raw = raw.concat(arr);
      });
    } else {
      raw = apiData[currentTab] || [];
    }

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

  const handleEdit = (i) => {
    setEditingRowIndex(i);
    setEditedData({ ...data[i] });
  };

  const handleCancel = () => {
    setEditingRowIndex(null);
    setEditedData({});
  };

  const getCategoryKeyFromLabel = (label) => {
    const map = {
      "Vegetable and Fruits": "vegetablesFruits",
      milk: "milk",
      "Kirana Store": "kiranaStore",
      "Fast Food": "fastFood",
      Homeneeds: "homeNeeds",
      Petrol: "petrol",
      outing: "outing",
      "House Rent": "houseRent",
      "Wifi Bill": "wifi",
      "Electricity Bill": "electricity",
      "Gas Bill": "gas",
      homeloan: "homeloan",
      income: "income",
      investment: "investment",
      lic: "lic",
      parents: "parents",
      "Personal Expense": "personalExpense",
      "Advitya Flat Cost": "advityaFlatCost",
      "Mumbai Home Setup Cost": "mumbaiHomeSetupCost",
      "Cred Loan Repay": "credLoanRepay",
      "Mumbai Misc": "mumbaiMisc",
      "Faridabad Misc": "faridabadMisc",
    };
    return map[label] || "";
  };

  const onChangeEditHandler = (e, key) => {
    setEditedData((prev) => {
      const updated = { ...prev, [key]: e.target.value };
      saveData.current = updated;
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      const category = getCategoryKeyFromLabel(currentTab);
      const response = await fetch(
        `${API_URL}/user/raghav/${category}/${saveData?.current?._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(saveData?.current),
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.msg);
      alert("Entry updated successfully");
      fetchData();
    } catch (error) {
      console.error("Error updating entry:", error);
      alert("Failed to update entry");
    }
    setEditingRowIndex(null);
    setEditedData({});
  };

  const handleDelete = async (index) => {
    const entryId = data[index]._id;
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      const category = getCategoryKeyFromLabel(currentTab);
      const response = await fetch(
        `${API_URL}/user/raghav/${category}/${entryId}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.msg);
      alert("Entry deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry");
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
        Cell: ({ row, value }) =>
          editingRowIndex === row.index ? (
            <TextField
              defaultValue={editedData[key] ?? ""}
              onChange={(e) => onChangeEditHandler(e, key)}
              size="small"
              fullWidth
            />
          ) : key === "timestamp" ? (
            formatTimestamp(value)
          ) : (
            value
          ),
      })),
      {
        Header: "Actions",
        id: "actions",
        Cell: ({ row }) =>
          editingRowIndex === row.index ? (
            <Box display="flex" gap={1}>
              <Button size="small" onClick={handleSave}>
                Save
              </Button>
              <Button size="small" onClick={handleCancel}>
                Cancel
              </Button>
            </Box>
          ) : (
            <Box display="flex" gap={1}>
              <Button
                size="small"
                onClick={() => handleEdit(row.index)}
                variant="outlined"
              >
                Edit
              </Button>
              <Button
                size="small"
                onClick={() => handleDelete(row.index)}
                color="error"
                variant="outlined"
              >
                Delete
              </Button>
            </Box>
          ),
      },
    ];
  }, [data, editingRowIndex]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState: {
          sortBy: [{ id: "timestamp", desc: true }],
        },
      },
      useSortBy
    );

  return (
    <>
      <Header backLink={"/dashboard"} title="Data Tables" />
      <Box p={2}>
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
          <Box
            display="flex"
            flexWrap="wrap"
            gap={2}
            alignItems="center"
            mb={2}
          >
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              format="DD/MM/YYYY"
              sx={{ width: isMobile ? "100%" : "auto" }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              format="DD/MM/YYYY"
              sx={{ width: isMobile ? "100%" : "auto" }}
            />
            <Button onClick={() => [setStartDate(null), setEndDate(null)]}>
              Clear Filter
            </Button>
          </Box>
        </LocalizationProvider>

        <Paper
          sx={{
            mt: 2,
            overflowX: "auto",
            height: "75vh",
            width: "100%",
          }}
        >
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
                      zIndex: 1,
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
                <tr
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "20px",
                    padding: "50px",
                  }}
                >
                  <td colSpan={columns.length}>Loading...</td>
                </tr>
              ) : rows.length === 0 ? (
                <tr
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "20px",
                    padding: "50px",
                  }}
                >
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
