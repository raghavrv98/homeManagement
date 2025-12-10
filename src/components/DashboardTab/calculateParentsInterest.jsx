import { useMemo } from "react";

const getMonthsPassed = (monthName) => {
  const monthIndex = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  const entryMonth = monthIndex[monthName];
  const currentMonth = new Date().getMonth(); // 0–11

  let diff = currentMonth - entryMonth;

  // Across year boundary
  if (diff < 0) diff += 12;

  return diff; // current month not counted
};

export const useParentsInterest = (apiData = []) => {
  const monthlyIncome = 30000;
  const { interestList, totalInterest } = useMemo(() => {
    let total = 0;

    const list = apiData.map((monthObj) => {
      const paid = Number(monthObj?.Parents || 0);
      const monthsPassed = getMonthsPassed(monthObj.month);

      // ✔ leftover becomes negative if payment > monthlyIncome
      const leftover = monthlyIncome - paid;

      // ✔ interest positive for leftover, negative for overpayment
      const interest = Math.round(leftover * monthsPassed * 0.01);

      // accumulate interest
      total += interest;

      return {
        month: monthObj.month,
        paid,
        leftover, // can be negative
        monthsPassed,
        interest, // can be negative
      };
    });

    return { interestList: list, totalInterest: total };
  }, [apiData]);

  return { interestList, totalInterest };
};
