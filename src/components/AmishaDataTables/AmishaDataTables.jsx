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

// ✅ Added Repay & Gift Cost
const tabLabels = ["Income", "Investment", "Expenses", "Repay", "Gift Cost"];

const AmishaDataTables = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedTab, setSelectedTab] = useState(0);
  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const currentTab = tabLabels[selectedTab]; // Active tab
  const saveData = useRef({ ...editedData });

  /**
   * ✅ Fetch all 5 categories: income, investment, expenses, repay, giftCost
   */
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/users/raghav`);
      const result = await response.json();

      if (response.ok) {
        setApiData({
          Income: result.data[0]?.money?.amishaIncome,
          Investment: result.data[0]?.money?.amishaInvestment,
          Expenses: result.data[0]?.money?.amishaExpenses,
          Repay: result.data[0]?.money?.amishaRepay,
          "Gift Cost": result.data[0]?.money?.amishaGiftCost,
        });
      } else {
        console.error(result.msg || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /**
   * ✅ Filter data by current tab + date range
   */
  const data = useMemo(() => {
    let raw = apiData[currentTab] || [];
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

  /**
   * ✅ Editing row
   */
  const handleEdit = (i) => {
    setEditingRowIndex(i);
    setEditedData({ ...data[i] });
  };
  const handleCancel = () => {
    setEditingRowIndex(null);
    setEditedData({});
  };
  const onChangeEditHandler = (e, key) => {
    setEditedData((prev) => {
      const updated = { ...prev, [key]: e.target.value };
      saveData.current = updated;
      return updated;
    });
  };

  /**
   * ✅ Save changes
   */
  const handleSave = async () => {
    try {
      const response = await fetch(
        `${API_URL}/user/raghav/amisha${currentTab.replace(" ", "")}/${
          saveData?.current?._id
        }`,
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
      console.error("Error updating entry:", error.message);
      alert("Failed to update entry");
    }
    setEditingRowIndex(null);
    setEditedData({});
  };

  /**
   * ✅ Delete entry
   */
  const handleDelete = async (index) => {
    const entryId = data[index]._id;
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      const response = await fetch(
        `${API_URL}/user/raghav/amisha${currentTab.replace(
          " ",
          ""
        )}/${entryId}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.msg);
      alert("Entry deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting entry:", error.message);
      alert("Failed to delete entry");
    }
  };

  /**
   * ✅ Format timestamp for table
   */
  const formatTimestamp = (iso) => {
    const date = new Date(iso);
    return dayjs(date).format("DD MMM YYYY hh:mm A");
  };

  /**
   * ✅ Calculate totals row
   */
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

  /**
   * ✅ Build table columns
   */
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
        {/* ✅ Tabs now include Repay + Gift Cost */}
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

        {/* ✅ Date filters */}
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

        {/* ✅ Table */}
        <Paper sx={{ mt: 2, overflowX: "auto", height: "75vh", width: "100%" }}>
          <table
            {...getTableProps()}
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              {/* ✅ Totals row */}
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
              {/* ✅ Headers */}
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
                  <td
                    colSpan={columns.length}
                    style={{ textAlign: "center", padding: "50px" }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    style={{ textAlign: "center", padding: "50px" }}
                  >
                    No data
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

export default AmishaDataTables;
