import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
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
const tabLabels = ["Income", "Repay", "Gift Cost"];

const AmishaDataTables = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();

  const [selectedTab, setSelectedTab] = useState(0);
  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  // Pre-select tab + date range when navigated from another page
  useEffect(() => {
    const state = location.state;
    if (!state) return;
    if (state.tab !== undefined) {
      const tabIdx = tabLabels.indexOf(state.tab);
      if (tabIdx !== -1) setSelectedTab(tabIdx);
    }
    if (state.startDate) setStartDate(dayjs(state.startDate));
    if (state.endDate) setEndDate(dayjs(state.endDate));
  }, [location.state]);

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
          "Monthly Expense": result.data[0]?.money?.amishaMonthlyExpense,
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
        },
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
          "",
        )}/${entryId}`,
        { method: "DELETE" },
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
  }, [data, currentTab]);

  /**
   * ✅ Build table columns
   */

  const columns = useMemo(() => {
    if (!data.length) return [];
    const keys = Object.keys(data[0]).filter((key) => key !== "_id");

    let dynamicColumns = keys.map((key) => ({
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
    }));

    return [
      {
        Header: "#",
        accessor: (_, i) => i + 1,
        id: "index",
      },
      ...dynamicColumns,
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
  }, [data, editingRowIndex, currentTab]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState: {
          sortBy: [{ id: "timestamp", desc: true }],
        },
      },
      useSortBy,
    );

  return (
    <>
      <Header backLink={"/dashboard"} title="Data Tables" />
      <div className="p-4 sm:p-6 w-full">
        {/* ✅ Tabs now include Repay + Gift Cost */}
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          className="mb-4 bg-white rounded-2xl p-1 border border-slate-200/80 shadow-xs"
        >
          {tabLabels.map((label, idx) => (
            <Tab
              key={idx}
              label={label}
              className="!text-xs !font-semibold !capitalize"
            />
          ))}
        </Tabs>

        {/* ✅ Date filters */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="flex flex-wrap gap-3 items-center mb-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              format="DD/MM/YYYY"
              sx={{ width: isMobile ? "100%" : "auto" }}
              slotProps={{ textField: { size: "small" } }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              format="DD/MM/YYYY"
              sx={{ width: isMobile ? "100%" : "auto" }}
              slotProps={{ textField: { size: "small" } }}
            />
            <button
              type="button"
              onClick={() => [setStartDate(null), setEndDate(null)]}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Clear Filter
            </button>
          </div>
        </LocalizationProvider>

        {/* ✅ Table */}
        <div className="overflow-x-auto max-h-[75vh] w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <table
            {...getTableProps()}
            className="w-full border-collapse text-left text-sm text-slate-700"
          >
            <thead>
              {/* ✅ Totals row */}
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.id}
                    className="border-b border-emerald-200 px-4 py-3 bg-emerald-50 text-emerald-900 font-bold sticky top-0 z-10 text-xs uppercase tracking-wider"
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
                      className="border-b border-slate-200 px-4 py-3 bg-slate-100 text-slate-700 font-semibold cursor-pointer hover:bg-slate-200/80 transition-colors select-none text-xs tracking-wider"
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
                    className="text-center py-16 text-slate-400 font-medium text-base"
                  >
                    Loading...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-16 text-slate-400 font-medium text-base"
                  >
                    No data
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={row.id}
                      className="border-b border-slate-100 hover:bg-indigo-50/40 transition-colors even:bg-slate-50/50"
                    >
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          key={cell.column.id}
                          className="px-4 py-2.5 border-r border-slate-100 last:border-r-0 whitespace-nowrap text-xs text-slate-700"
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
        </div>
      </div>
    </>
  );
};

export default AmishaDataTables;
