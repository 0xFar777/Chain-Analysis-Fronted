import React, { useState, useEffect } from "react";

const DateSelectionComponent = ({ timeRange, onSubmit }) => {
  // 计算起点日期和终点日期
  const startDate = new Date(timeRange.start * 1000);
  const endDate = new Date(timeRange.end * 1000) ;

  // 初始化年、月、日的选项
  const [startYears, setStartYears] = useState([]);
  const [startMonths, setStartMonths] = useState([]);
  const [startDays, setStartDays] = useState([]);

  const [endYears, setEndYears] = useState([]);
  const [endMonths, setEndMonths] = useState([]);
  const [endDays, setEndDays] = useState([]);

  // 初始化选择的日期
  const [startYear, setStartYear] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startDay, setStartDay] = useState("");

  const [endYear, setEndYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endDay, setEndDay] = useState("");

  useEffect(() => {
    // 初始化开始时间的年份选项
    const startDateYear = startDate.getFullYear();
    const endDateYear = endDate.getFullYear();
    const yearOptions = [];
    for (let year = startDateYear; year <= endDateYear; year++) {
      yearOptions.push(year.toString());
    }
    setStartYears(yearOptions);
    setStartMonth("")
    setStartDay("");
    setEndYear("");
    setEndMonth("");
    setEndDay("")
  }, [timeRange]);

  useEffect(() => {
    // 初始化开始时间的月份选项
    const startDateMonth = startDate.getMonth() + 1;
    const endDateMonth = endDate.getMonth() + 1;
    console.log(startDate, endDate);
    let monthOptions = [];
    if (startYear == startDate.getFullYear()) {
      monthOptions = Array.from(
        { length: 13 - parseInt(startDateMonth) },
        (_, i) => `${parseInt(startDateMonth) + i}`
      );
    } else if (startYear == endDate.getFullYear()) {
      monthOptions = Array.from({ length: endDateMonth }, (_, i) => `${i + 1}`);
    } else {
      monthOptions = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
    }
    setStartMonths(monthOptions);
  }, [startYear]);

  useEffect(() => {
    if (startMonth == "") {
      return;
    }
    // 初始化开始时间的日期选项
    const startDateDay = startDate.getDate();
    const endDateDay = endDate.getDate();
    const daysInMonth = new Date(startYear, startMonth, 0).getDate();
    let dayOptions = [];
    if (
      startYear == startDate.getFullYear() &&
      startMonth == startDate.getMonth() + 1
    ) {
      dayOptions = Array.from(
        { length: daysInMonth + 1 - startDateDay },
        (_, i) => `${startDateDay + i}`
      );
    } else if (
      startYear == endDate.getFullYear() &&
      startMonth == endDate.getMonth() + 1
    ) {
      dayOptions = Array.from({ length: endDateDay - 1 }, (_, i) => `${i + 1}`);
    } else {
      dayOptions = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
    }
    setStartDays(dayOptions);
  }, [startYear, startMonth]);

  useEffect(() => {
    // 初始化结束时间的年份选项
    if (startYear !== "") {
      const start = parseInt(startYear);
      const endDateYear = endDate.getFullYear();
      const yearOptions = [];
      for (let year = start; year <= endDateYear; year++) {
        yearOptions.push(year.toString());
      }
      setEndYears(yearOptions);
    }
  }, [startYear]);

  useEffect(() => {
    if (startMonth == "" || startDay == "" || endYear == "") {
      return;
    }
    // 初始化结束时间的月份选项
    const endDateYear = endDate.getFullYear();
    const endDateMonth = endDate.getMonth() + 1;
    console.log(startMonth);
    let monthOptions = [];
    if (endYear !== "") {
      if (startYear == endYear) {
        if (endYear == endDateYear) {
          monthOptions = Array.from(
            { length: parseInt(endDateMonth) - parseInt(startMonth) + 1 },
            (_, i) => `${i + parseInt(startMonth)}`
          );
        } else {
          monthOptions = Array.from(
            { length: 13 - parseInt(startMonth) },
            (_, i) => `${i + parseInt(startMonth)}`
          );
        }
      } else {
        if (endYear == endDateYear) {
          monthOptions = Array.from(
            {
              length: parseInt(endDateMonth),
            },
            (_, i) => `${i + 1}`
          );
        } else {
          monthOptions = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
        }
      }
      setEndMonths(monthOptions);
    }
  }, [endYear, startYear, startMonth, startDay]);

  useEffect(() => {
    // 根据选择的年份和月份动态生成日期选项
    if (startMonth == "" || startDay == "" || endMonth == "" || endYear == "") {
      return;
    }
    let dayOptions = [];
    const endDateYear = endDate.getFullYear();
    const endDateMonth = endDate.getMonth() + 1;
    const endDateDay = endDate.getDate();
    const daysInMonth = new Date(endYear, endMonth, 0).getDate();
    if (endYear !== "" && endMonth !== "") {
      if (startYear == endYear && startMonth == endMonth) {
        if (endMonth == endDateMonth) {
          dayOptions = Array.from(
            { length: parseInt(endDateDay) - parseInt(startDay) },
            (_, i) => `${i + parseInt(startDay) + 1}`
          );
        } else {
          dayOptions = Array.from(
            { length: parseInt(daysInMonth) - parseInt(startDay) },
            (_, i) => `${i + parseInt(startDay) + 1}`
          );
        }
      } else if (endYear == endDateYear && endMonth == endDateMonth) {
        dayOptions = Array.from(
          { length: parseInt(endDateDay) },
          (_, i) => `${i + 1}`
        );
      } else {
        dayOptions = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
      }
    }
    setEndDays(dayOptions);
  }, [endYear, endMonth, startYear, startMonth, startDay]);

  const handleStartYearChange = (year) => {
    setStartYear(year);
    setStartMonth("");
    setStartDay("");
    setEndYear("");
    setEndMonth("");
    setEndDay("");
    if (year !== "") {
      const start = parseInt(year);
      const endYear = endDate.getFullYear();
      const yearOptions = [];
      for (let y = start; y <= endYear; y++) {
        yearOptions.push(y.toString());
      }
      setEndYears(yearOptions);
    }
  };

  const handleEndYearChange = (year) => {
    setEndYear(year);
    setEndMonth("");
    setEndDay("");
  };

  const handleStartMonthChange = (month) => {
    setStartMonth(month);
    setStartDay("");
  };

  const handleEndMonthChange = (month) => {
    setEndMonth(month);
    setEndDay("");
  };

  const handleConfirm = () => {
    if (startYear && startMonth && startDay && endYear && endMonth && endDay) {
      const startTimeStamp =
        new Date(startYear, startMonth - 1, startDay).getTime() / 1000;
      const endTimeStamp =
        new Date(endYear, endMonth - 1, endDay).getTime() / 1000;
      onSubmit({
        startTimeStamp,
        endTimeStamp,
      });
    } else {
      console.log("Please select start and end dates.");
    }
  };

  return (
    <div style={{ margin: "0px", display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <label className="select-title">Start Date</label>
        <div style={{ marginRight: "3%" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <select
              value={startYear}
              onChange={(e) => handleStartYearChange(e.target.value)}
              className="select-time"
            >
              <option value="">Select Year</option>
              {startYears.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              value={startMonth}
              onChange={(e) => handleStartMonthChange(e.target.value)}
              disabled={!startYear}
              className="select-time"
            >
              <option value="">Select Month</option>
              {startMonths.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={startDay}
              onChange={(e) => setStartDay(e.target.value)}
              disabled={!startMonth}
              className="select-time"
            >
              <option value="">Select Day</option>
              {startDays.map((day, index) => (
                <option key={index} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleConfirm}
          className={`add-button ${
            startDay == "" || endDay == "" ? "button-disabled" : ""
          }`}
          disabled={startDay == "" || endDay == ""}
          // style={{
          //   padding: "8px 16px",
          //   backgroundColor: "#fff",
          //   color: "#f0f",
          //   border: "2px solid #ccc",
          //   borderRadius: "4px",
          //   cursor: "pointer",
          // }}
        >
          Confirm
        </button>
        <div style={{ marginLeft: "3.5%" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <select
              value={endYear}
              onChange={(e) => handleEndYearChange(e.target.value)}
              disabled={!startYear || !startMonth || !startDay}
              className="select-time"
            >
              <option value="">Select Year</option>
              {endYears.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              value={endMonth}
              onChange={(e) => handleEndMonthChange(e.target.value)}
              disabled={!startYear || !startMonth || !startDay || !endYear}
              className="select-time"
            >
              <option value="">Select Month</option>
              {endMonths.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={endDay}
              onChange={(e) => setEndDay(e.target.value)}
              disabled={
                !startYear || !startMonth || !startDay || !endYear || !endMonth
              }
              className="select-time"
            >
              <option value="">Select Day</option>
              {endDays.map((day, index) => (
                <option key={index} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>
        <label className="select-title">End Date</label>
      </div>
    </div>
  );
};

export default DateSelectionComponent;
