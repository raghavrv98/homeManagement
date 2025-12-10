import { useMemo } from "react";
import dayjs from "dayjs";

const calculateInterest = (amount, timestamp) => {
  if (!amount || !timestamp) return 0;

  const entryDate = dayjs(timestamp);
  const today = dayjs();

  // Difference in whole months
  const monthsPassed = today.diff(entryDate, "month");

  return Math.round(amount * monthsPassed * 0.01); // 1% per month
};

export const useFaridabadIncome = (data = []) => {
  const result = useMemo(() => {
    if (!Array.isArray(data)) {
      return {
        faridabadList: [],
        listWithInterest: [],
        totalFaridabadIncome: 0,
        totalInterestOnAmountTaken: 0,
      };
    }

    // Filter: FARIDABAD entries only
    const faridabadList = data.filter((item) =>
      item?.source?.toLowerCase().includes("faridabad")
    );

    // Calculate interest for each entry
    const listWithInterest = faridabadList.map((item) => {
      const amount = Number(item.cost || 0);
      const interest = calculateInterest(amount, item.timestamp);

      return {
        ...item,
        monthsPassed: dayjs().diff(dayjs(item.timestamp), "month"),
        interest,
      };
    });

    // Total income
    const totalFaridabadIncome = faridabadList.reduce(
      (sum, item) => sum + Number(item.cost || 0),
      0
    );

    // Total interest
    const totalInterestOnAmountTaken = listWithInterest.reduce(
      (sum, item) => sum + item.interest,
      0
    );

    return {
      faridabadList,
      listWithInterest,
      totalFaridabadIncome,
      totalInterestOnAmountTaken,
    };
  }, [data]);

  return result;
};
