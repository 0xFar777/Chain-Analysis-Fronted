import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";

const KChart = ({ Asset }) => {
  const [klineData, setKlineData] = useState([]);
  const [dataZoomStart, setDataZoomStart] = useState(0);
  const [dataZoomEnd, setDataZoomEnd] = useState(100);
  const [yAxisMin, setYAxisMin] = useState(null);
  const [yAxisMax, setYAxisMax] = useState(null);
  const [tooltipData, setTooltipData] = useState({
    date: "",
    open: "",
    close: "",
    low: "",
    high: "",
    volume: "",
    quote_volume: "",
    Increase: "",
    Amplitude: "",
    color: "",
  }); // tooltip 显示的数据
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [asset, setAsset] = useState("");
  const [DataIndex, setDataIndex] = useState(null);
  const [periodSelection, setPeriodSelection] = useState("day");
  const [showMA5, setShowMA5] = useState(true); // 默认显示MA5
  const [showMA10, setShowMA10] = useState(true); // 默认显示MA10
  const [showMA20, setShowMA20] = useState(true); // 默认显示MA20
  const [showMA60, setShowMA60] = useState(true); // 默认显示MA60
  const [showMA120, setShowMA120] = useState(true); // 默认显示MA120
  const [showBoll, setShowBoll] = useState(true); // 默认显示布林带
  const [showIndicator, setShowIndicator] = useState("WR");
  const [maData, setMAData] = useState([]);
  const [maShowData, setMAShowData] = useState({
    date: "",
    MA5: "",
    MA10: "",
    MA20: "",
    MA60: "",
    MA120: "",
  });
  const [bollData, setBollData] = useState([]);
  const [bollShowData, setBollShowData] = useState({
    date: "",
    MiddleBand: "",
    UpperBand: "",
    LowerBand: "",
  });
  const [KDJData, setKDJData] = useState([]);
  const [KDJShowData, setKDJShowData] = useState({
    date: "",
    K: "",
    D: "",
    J: "",
  });
  const [RSIData, setRSIData] = useState([]);
  const [RSIShowData, setRSIShowData] = useState({
    date: "",
    RSI_6: "",
    RSI_12: "",
    RSI_24: "",
  });
  const [MACDData, setMACDData] = useState([]);
  const [MACDShowData, setMACDShowData] = useState({
    date: "",
    DEA: "",
    DIF: "",
    MACD: "",
  });
  const [WRData, setWRData] = useState([]);
  const [WRShowData, setWRShowData] = useState({
    date: "",
    WilliamsR: "",
  });
  const [lastData, setLastData] = useState([
    {
      date: "",
      open: "",
      close: "",
      high: "",
      low: "",
      volume: "",
      quote_volume: "",
      Increase: "",
      Amplitude: "",
      color: "",
      ma5: "",
      ma10: "",
      ma20: "",
      ma60: "",
      ma120: "",
      MiddleBand: "",
      UpperBand: "",
      LowerBand: "",
      K: "",
      D: "",
      J: "",
      RSI_6: "",
      RSI_12: "",
      RSI_24: "",
      DEA: "",
      DIF: "",
      MACD: "",
      WilliamsR: "",
    },
  ]);

  useEffect(() => {
    if (Asset != "Compare" && Asset != "") {
      setAsset(Asset);
    }
    if (loading || Asset == "") {
      return;
    }
    setLoading(true);
    setLastData([
      {
        date: "",
        open: "",
        close: "",
        high: "",
        low: "",
        volume: "",
        quote_volume: "",
        Increase: "",
        Amplitude: "",
        color: "",
        ma5: "",
        ma10: "",
        ma20: "",
        ma60: "",
        ma120: "",
        MiddleBand: "",
        UpperBand: "",
        LowerBand: "",
        K: "",
        D: "",
        J: "",
        RSI_6: "",
        RSI_12: "",
        RSI_24: "",
        DEA: "",
        DIF: "",
        MACD: "",
        WilliamsR: "",
      },
    ]);
    chartRef.current = null;
    const fetchData = async () => {
      await Promise.all([
        fetchUIKData(),
        fetchMAData(),
        fetchBollData(),
        fetchWRData(),
        fetchMACDData(),
        fetchKDJData(),
        fetchRSIData(),
      ]);
      fetchCSVData();
    };
    fetchData();
  }, [Asset, periodSelection]);

  useEffect(() => {
    setDataIndex(klineData.length + lastData.length);
    // setTimeout(() => {
    //   setLoading(false);
    // }, 2000);
    setLoading(false);
  }, [klineData]);

  // useEffect(() => {
  //   if (DataIndex < klineData.length + lastData.length) {
  //     return;
  //   }
  //   if (loading) {
  //     return;
  //   }
  //   const intervalId = setInterval(() => {
  //     console.log(Asset);
  //     fetchUIKData2();
  //   }, 300000);
  //   // 在组件卸载时清除定时器
  //   return () => clearInterval(intervalId);
  // }, [DataIndex, loading]);

  useEffect(() => {
    if (
      !loading &&
      klineData.length > 0 &&
      lastData[lastData.length - 1].date != ""
    ) {
      renderKLineChart();
      updateYAxisRange(dataZoomStart, dataZoomEnd);
    }
  }, [
    klineData,
    loading,
    dataZoomStart,
    dataZoomEnd,
    yAxisMax,
    yAxisMin,
    showIndicator,
  ]);

  useEffect(() => {
    // let isMounted = true;
    if (chartRef.current == null || loading) {
      return;
    }
    const chartInstance = chartRef.current;
    if (chartInstance) {
      chartInstance.on("dataZoom", handleDataZoom);
      chartInstance.getZr().on("mousemove", handleMouseMove);
      chartInstance.getZr().on("mouseout", handleMouseOut);
    }
    return () => {
      if (chartInstance) {
        chartInstance.off("dataZoom", handleDataZoom);
        chartInstance.getZr().off("mousemove", handleMouseMove);
        chartInstance.getZr().off("mouseout", handleMouseOut);
      }
      // isMounted = false;
    };
  }, [chartRef.current, loading]);

  const handleDataZoom = (params) => {
    const newZoomStart = params.batch[0].start;
    const newZoomEnd = params.batch[0].end;
    setDataZoomStart(newZoomStart);
    setDataZoomEnd(newZoomEnd);
  };

  const handleMouseMove = (event) => {
    if (loading || chartRef.current == null) {
      return;
    }
    const mouseX = event.offsetX;
    const chartInstance = chartRef.current;
    console.log("mmmmmmmmmmmmmmmmmmmmmmmmm");
    console.log(klineData.length);
    console.log("mmmmmmmmmmmmmmmmmmmmmmmmm");
    if (chartInstance) {
      const dataIndex = chartInstance.convertFromPixel({ seriesIndex: 0 }, [
        mouseX,
        0,
      ])[0];
      console.log(`dataIndex is ${dataIndex}`);
      setDataIndex(dataIndex);
      if (dataIndex >= 0 && dataIndex < klineData.length) {
        const tooltip = klineData[dataIndex];
        const maShow = maData[dataIndex];
        const bollShow = bollData[dataIndex];
        const macdShow = MACDData[dataIndex];
        const kdjShow = KDJData[dataIndex];
        const rsiShow = RSIData[dataIndex];
        const wrShow = WRData[dataIndex];
        setTooltipData(tooltip);
        setMAShowData(maShow);
        setBollShowData(bollShow);
        setMACDShowData(macdShow);
        setKDJShowData(kdjShow);
        setRSIShowData(rsiShow);
        setWRShowData(wrShow);
      } else if (dataIndex >= klineData.length) {
        const lastDayData = {
          date: formatTime(lastData[dataIndex - klineData.length].date),
          open: lastData[dataIndex - klineData.length].open,
          close: lastData[dataIndex - klineData.length].close,
          low: lastData[dataIndex - klineData.length].low,
          high: lastData[dataIndex - klineData.length].high,
          volume: lastData[dataIndex - klineData.length].volume,
          quote_volume: lastData[dataIndex - klineData.length].quote_volume,
          Increase: lastData[dataIndex - klineData.length].Increase,
          Amplitude: lastData[dataIndex - klineData.length].Amplitude,
          color: lastData[dataIndex - klineData.length].color,
        };
        const lastMAData = {
          date: formatTime(lastData[dataIndex - klineData.length].date),
          MA5: lastData[dataIndex - klineData.length].ma5,
          MA10: lastData[dataIndex - klineData.length].ma10,
          MA20: lastData[dataIndex - klineData.length].ma20,
          MA60: lastData[dataIndex - klineData.length].ma60,
          MA120: lastData[dataIndex - klineData.length].ma120,
        };
        const lastBollData = {
          date: formatTime(lastData[dataIndex - klineData.length].date),
          MiddleBand: lastData[dataIndex - klineData.length].MiddleBand,
          UpperBand: lastData[dataIndex - klineData.length].UpperBand,
          LowerBand: lastData[dataIndex - klineData.length].LowerBand,
        };
        const lastMACDData = {
          date: formatTime(lastData[dataIndex - klineData.length].date),
          DEA: lastData[dataIndex - klineData.length].DEA,
          DIF: lastData[dataIndex - klineData.length].DIF,
          MACD: lastData[dataIndex - klineData.length].MACD,
        };
        const lastKDJData = {
          date: formatTime(lastData[dataIndex - klineData.length].date),
          K: lastData[dataIndex - klineData.length].K,
          D: lastData[dataIndex - klineData.length].D,
          J: lastData[dataIndex - klineData.length].J,
        };
        const lastRSIData = {
          date: formatTime(lastData[dataIndex - klineData.length].date),
          RSI_6: lastData[dataIndex - klineData.length].RSI_6,
          RSI_12: lastData[dataIndex - klineData.length].RSI_12,
          RSI_24: lastData[dataIndex - klineData.length].RSI_24,
        };
        const lastWRData = {
          date: formatTime(lastData[dataIndex - klineData.length].date),
          WilliamsR: lastData[dataIndex - klineData.length].WilliamsR,
        };
        setTooltipData(lastDayData);
        setMAShowData(lastMAData);
        setBollShowData(lastBollData);
        setMACDShowData(lastMACDData);
        setKDJShowData(lastKDJData);
        setRSIShowData(lastRSIData);
        setWRShowData(lastWRData);
      }
    }
  };

  const formatTime = (time) => {
    const date = new Date(time);
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    if (periodSelection == "day") {
      return `${year}-${month}-${day}`;
    } else {
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  };

  const handleMouseOut = () => {
    if (loading || chartRef.current == null) {
      return;
    }
    // 返回默认数据（最新日数据）
    if (lastData[lastData.length - 1].date != "") {
      const lastDayData = {
        date: formatTime(lastData[lastData.length - 1].date),
        open: lastData[lastData.length - 1].open,
        close: lastData[lastData.length - 1].close,
        low: lastData[lastData.length - 1].low,
        high: lastData[lastData.length - 1].high,
        volume: lastData[lastData.length - 1].volume,
        quote_volume: lastData[lastData.length - 1].quote_volume,
        Increase: lastData[lastData.length - 1].Increase,
        Amplitude: lastData[lastData.length - 1].Amplitude,
        color: lastData[lastData.length - 1].color,
      };
      const lastMAData = {
        date: formatTime(lastData[lastData.length - 1].date),
        MA5: lastData[lastData.length - 1].ma5,
        MA10: lastData[lastData.length - 1].ma10,
        MA20: lastData[lastData.length - 1].ma20,
        MA60: lastData[lastData.length - 1].ma60,
        MA120: lastData[lastData.length - 1].ma120,
      };
      const lastBollData = {
        date: formatTime(lastData[lastData.length - 1].date),
        MiddleBand: lastData[lastData.length - 1].MiddleBand,
        UpperBand: lastData[lastData.length - 1].UpperBand,
        LowerBand: lastData[lastData.length - 1].LowerBand,
      };
      const lastMACDData = {
        date: formatTime(lastData[lastData.length - 1].date),
        DEA: lastData[lastData.length - 1].DEA,
        DIF: lastData[lastData.length - 1].DIF,
        MACD: lastData[lastData.length - 1].MACD,
      };
      const lastKDJData = {
        date: formatTime(lastData[lastData.length - 1].date),
        K: lastData[lastData.length - 1].K,
        D: lastData[lastData.length - 1].D,
        J: lastData[lastData.length - 1].J,
      };
      const lastRSIData = {
        date: formatTime(lastData[lastData.length - 1].date),
        RSI_6: lastData[lastData.length - 1].RSI_6,
        RSI_12: lastData[lastData.length - 1].RSI_12,
        RSI_24: lastData[lastData.length - 1].RSI_24,
      };
      const lastWRData = {
        date: formatTime(lastData[lastData.length - 1].date),
        WilliamsR: lastData[lastData.length - 1].WilliamsR,
      };
      setTooltipData(lastDayData);
      setMAShowData(lastMAData);
      setBollShowData(lastBollData);
      setMACDShowData(lastMACDData);
      setKDJShowData(lastKDJData);
      setRSIShowData(lastRSIData);
      setWRShowData(lastWRData);
      setDataIndex(klineData.length + lastData.length);
    }
  };

  const updateYAxisRange = (start, end) => {
    if (klineData.length === 0) return;
    const last = lastData.map((item) => ({
      date: formatTime(item.date),
      open: Number(item.open),
      close: Number(item.close),
      low: Number(item.low),
      high: Number(item.high),
    }));
    const newData = [...klineData, ...last];
    console.log(`pppppppppp${newData[newData.length - 1].date}`);
    // const startIdx = Math.floor((start / 100) * klineData.length);
    // const endIdx = Math.floor((end / 100) * klineData.length);
    // const zoomedData = klineData.slice(startIdx, endIdx + 1);
    const startIdx = Math.floor((start / 100) * newData.length);
    const endIdx = Math.floor((end / 100) * newData.length);
    const zoomedData = newData.slice(startIdx, endIdx + 1);

    const validLowValues = zoomedData
      .map((item) => item.low)
      .filter((value) => !isNaN(value));
    const validHighValues = zoomedData
      .map((item) => item.high)
      .filter((value) => !isNaN(value));

    const lowestLow = Math.min(...validLowValues);
    const highestHigh = Math.max(...validHighValues);

    setYAxisMin(lowestLow);
    setYAxisMax(highestHigh);
  };

  // const fetchCSVData = () => {
  //   fetch(
  //     `http://127.0.0.1:5000/change?csv_file=app/data/change/${
  //       Asset == "Compare" ? asset : Asset
  //     }/${periodSelection}.csv`
  //   )
  //     .then((response) => {
  //       return response.json(); // 返回一个 Promise 对象
  //     })
  //     .then((data) => {
  //       parsePriceData(data);
  //     })
  //     .catch((error) => console.error("Error fetching CSV file:", error));
  // };

  const fetchCSVData = () => {
    new Promise((resolve, reject) => {
      fetch(
        `http://127.0.0.1:5000/change?csv_file=app/data/change/${
          Asset == "Compare" ? asset : Asset
        }/${periodSelection}.csv`
      )
        .then((response) => response.json())
        .then((data) => {
          parsePriceData(data);
          resolve();
        })
        .catch((error) => {
          console.error("Error fetching CSV file:", error);
          reject(error);
        });
    });
  };

  const fetchMAData = () => {
    fetch(
      `http://127.0.0.1:5000/ma?csv_file=app/data/ma/${
        Asset == "Compare" ? asset : Asset
      }/${periodSelection}.csv`
    )
      .then((response) => response.json())
      .then((data) => {
        parseMAData(data);
      })
      .catch((error) => console.error("Error fetching CSV file:", error));
  };

  const fetchBollData = () => {
    fetch(
      `http://127.0.0.1:5000/boll?csv_file=app/data/boll/${
        Asset == "Compare" ? asset : Asset
      }/${periodSelection}.csv`
    )
      .then((response) => response.json())
      .then((data) => {
        parseBollData(data);
      })
      .catch((error) => console.error("Error fetching CSV file:", error));
  };

  const fetchMACDData = () => {
    fetch(
      `http://127.0.0.1:5000/macd?csv_file=app/data/macd/${
        Asset == "Compare" ? asset : Asset
      }/${periodSelection}.csv`
    )
      .then((response) => {
        return response.json(); // 返回一个 Promise 对象
      })
      .then((data) => {
        parseMACDData(data);
      })
      .catch((error) => console.error("Error fetching CSV file:", error));
  };

  const fetchKDJData = () => {
    fetch(
      `http://127.0.0.1:5000/kdj?csv_file=app/data/kdj/${
        Asset == "Compare" ? asset : Asset
      }/${periodSelection}.csv`
    )
      .then((response) => {
        return response.json(); // 返回一个 Promise 对象
      })
      .then((data) => {
        parseKDJData(data);
      })
      .catch((error) => console.error("Error fetching CSV file:", error));
  };

  const fetchRSIData = () => {
    fetch(
      `http://127.0.0.1:5000/rsi?csv_file=app/data/rsi/${
        Asset == "Compare" ? asset : Asset
      }/${periodSelection}.csv`
    )
      .then((response) => {
        return response.json(); // 返回一个 Promise 对象
      })
      .then((data) => {
        parseRSIData(data);
      })
      .catch((error) => console.error("Error fetching CSV file:", error));
  };

  const fetchWRData = () => {
    fetch(
      `http://127.0.0.1:5000/wr?csv_file=app/data/wr/${
        Asset == "Compare" ? asset : Asset
      }/${periodSelection}.csv`
    )
      .then((response) => {
        return response.json(); // 返回一个 Promise 对象
      })
      .then((data) => {
        parseWRData(data);
      })
      .catch((error) => console.error("Error fetching CSV file:", error));
  };

  const handlePeriod = (period) => {
    let res = "";
    if (period == "day") {
      res = "1d";
    } else if (period == "twelvehour") {
      res = "12h";
    } else if (period == "fourhour") {
      res = "4h";
    } else if (period == "onehour") {
      res = "1h";
    } else if (period == "fifteenminute") {
      res = "15m";
    } else if (period == "fiveminute") {
      res = "5m";
    } else {
    }
    return res;
  };

  const fetchUIKData = () => {
    const period = handlePeriod(periodSelection);
    fetch(
      `http://127.0.0.1:5000/lastday?asset=${
        Asset == "Compare" ? asset : Asset
      }&period=${period}`
    )
      .then((response) => {
        return response.json(); // 返回一个 Promise 对象
      })
      .then((data) => {
        parseLastKData(data);
      })
      .catch((error) => console.error("Error fetching CSV file:", error));
  };

  const fetchUIKData2 = () => {
    if (loading) {
      return;
    }
    const period = handlePeriod(periodSelection);
    fetch(
      `http://127.0.0.1:5000/lastday?asset=${
        Asset == "Compare" ? asset : Asset
      }&period=${period}`
    )
      .then((response) => {
        return response.json(); // 返回一个 Promise 对象
      })
      .then((data) => {
        parseLastKData2(data);
      })
      .catch((error) => console.error("Error fetching CSV file:", error));
  };

  const parseLastKData = (jsonData) => {
    if (jsonData && jsonData.length > 0) {
      // const last = jsonData[jsonData.length - 1];
      const last = jsonData;
      setLastData(jsonData);
      const lastDayData = {
        date: formatTime(last[last.length - 1].date),
        open: last[last.length - 1].open,
        close: last[last.length - 1].close,
        low: last[last.length - 1].low,
        high: last[last.length - 1].high,
        volume: last[last.length - 1].volume,
        quote_volume: last[last.length - 1].quote_volume,
        Increase: last[last.length - 1].Increase,
        Amplitude: last[last.length - 1].Amplitude,
        color: last[last.length - 1].color,
      };
      const lastMAData = {
        date: formatTime(last[last.length - 1].date),
        MA5: last[last.length - 1].ma5,
        MA10: last[last.length - 1].ma10,
        MA20: last[last.length - 1].ma20,
        MA60: last[last.length - 1].ma60,
        MA120: last[last.length - 1].ma120,
      };
      const lastBollData = {
        date: formatTime(last[last.length - 1].date),
        MiddleBand: last[last.length - 1].MiddleBand,
        UpperBand: last[last.length - 1].UpperBand,
        LowerBand: last[last.length - 1].LowerBand,
      };
      const lastMACDData = {
        date: formatTime(last[last.length - 1].date),
        DEA: last[last.length - 1].DEA,
        DIF: last[last.length - 1].DIF,
        MACD: last[last.length - 1].MACD,
      };
      const lastKDJData = {
        date: formatTime(last[last.length - 1].date),
        K: last[last.length - 1].K,
        D: last[last.length - 1].D,
        J: last[last.length - 1].J,
      };
      const lastRSIData = {
        date: formatTime(last[last.length - 1].date),
        RSI_6: last[last.length - 1].RSI_6,
        RSI_12: last[last.length - 1].RSI_12,
        RSI_24: last[last.length - 1].RSI_24,
      };
      const lastWRData = {
        date: formatTime(last[last.length - 1].date),
        WilliamsR: last[last.length - 1].WilliamsR,
      };
      setTooltipData(lastDayData);
      setMAShowData(lastMAData);
      setBollShowData(lastBollData);
      setMACDShowData(lastMACDData);
      setKDJShowData(lastKDJData);
      setRSIShowData(lastRSIData);
      setWRShowData(lastWRData);
    }
  };

  const parseLastKData2 = (jsonData) => {
    if (jsonData && jsonData.length > 0) {
      // console.log(`DataIndex is ${DataIndex}`);
      // console.log(`sssssssdddd${klineData.length + lastData.length}`);
      setLastData(jsonData);
      if (DataIndex == klineData.length + lastData.length) {
        const last = jsonData;
        const lastDayData = {
          date: formatTime(last[last.length - 1].date),
          open: last[last.length - 1].open,
          close: last[last.length - 1].close,
          low: last[last.length - 1].low,
          high: last[last.length - 1].high,
          volume: last[last.length - 1].volume,
          quote_volume: last[last.length - 1].quote_volume,
          Increase: last[last.length - 1].Increase,
          Amplitude: last[last.length - 1].Amplitude,
          color: last[last.length - 1].color,
        };
        const lastMAData = {
          date: formatTime(last[last.length - 1].date),
          MA5: last[last.length - 1].ma5,
          MA10: last[last.length - 1].ma10,
          MA20: last[last.length - 1].ma20,
          MA60: last[last.length - 1].ma60,
          MA120: last[last.length - 1].ma120,
        };
        const lastBollData = {
          date: formatTime(last[last.length - 1].date),
          MiddleBand: last[last.length - 1].MiddleBand,
          UpperBand: last[last.length - 1].UpperBand,
          LowerBand: last[last.length - 1].LowerBand,
        };
        const lastMACDData = {
          date: formatTime(last[last.length - 1].date),
          DEA: last[last.length - 1].DEA,
          DIF: last[last.length - 1].DIF,
          MACD: last[last.length - 1].MACD,
        };
        const lastKDJData = {
          date: formatTime(last[last.length - 1].date),
          K: last[last.length - 1].K,
          D: last[last.length - 1].D,
          J: last[last.length - 1].J,
        };
        const lastRSIData = {
          date: formatTime(last[last.length - 1].date),
          RSI_6: last[last.length - 1].RSI_6,
          RSI_12: last[last.length - 1].RSI_12,
          RSI_24: last[last.length - 1].RSI_24,
        };
        const lastWRData = {
          date: formatTime(last[last.length - 1].date),
          WilliamsR: last[last.length - 1].WilliamsR,
        };
        setTooltipData(lastDayData);
        setMAShowData(lastMAData);
        setBollShowData(lastBollData);
        setMACDShowData(lastMACDData);
        setKDJShowData(lastKDJData);
        setRSIShowData(lastRSIData);
        setWRShowData(lastWRData);
      }
    }
  };

  const parsePriceData = (jsonData) => {
    if (jsonData && jsonData.length > 0) {
      const lastDayData = jsonData[jsonData.length - 1];
      // setTooltipData(lastDayData);
      // console.log(lastDayData);
      setKlineData(jsonData);
      setDataZoomEnd(100);
      setDataZoomStart(100 - (120 / jsonData.length) * 100);
    }
  };

  const parseMAData = (jsonData) => {
    if (jsonData && jsonData.length > 0) {
      const lastMAData = jsonData[jsonData.length - 1];
      // setMAShowData(lastMAData);
      setMAData(jsonData);
    }
  };

  const parseBollData = (jsonData) => {
    if (jsonData && jsonData.length > 0) {
      const lastBollData = jsonData[jsonData.length - 1];
      // setBollShowData(lastBollData);
      setBollData(jsonData);
    }
  };

  const parseMACDData = (jsonData) => {
    if (jsonData && jsonData.length > 0) {
      const lastMACDData = jsonData[jsonData.length - 1];
      // setMACDShowData(lastMACDData);
      setMACDData(jsonData);
    }
  };

  const parseKDJData = (jsonData) => {
    if (jsonData && jsonData.length > 0) {
      const lastKDJData = jsonData[jsonData.length - 1];
      // setKDJShowData(lastKDJData);
      setKDJData(jsonData);
    }
  };

  const parseRSIData = (jsonData) => {
    if (jsonData && jsonData.length > 0) {
      const lastRSIData = jsonData[jsonData.length - 1];
      // setRSIShowData(lastRSIData);
      setRSIData(jsonData);
    }
  };

  const parseWRData = (jsonData) => {
    if (jsonData && jsonData.length > 0) {
      const lastWRData = jsonData[jsonData.length - 1];
      // setWRShowData(lastWRData);
      setWRData(jsonData);
    }
  };

  const formatNumberWithUnit = (num) => {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + "B";
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + "M";
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + "K";
    } else {
      return num.toFixed(3);
    }
  };

  const renderKLineChart = () => {
    if (klineData.length > 0) {
      const chartDom = document.getElementById("klineChart");
      let myChart = echarts.getInstanceByDom(chartDom);
      if (!myChart) {
        myChart = echarts.init(chartDom);
      }
      chartRef.current = myChart;
      let xAxisData = klineData.map((item) => item.date);
      let seriesData = klineData.map((item) => [
        item.open,
        item.close,
        item.low,
        item.high,
      ]);
      xAxisData = xAxisData.concat(
        lastData.map((item) => {
          const date = new Date(item.date);
          const year = date.getUTCFullYear();
          const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
          const day = date.getUTCDate().toString().padStart(2, "0");
          const hours = date.getUTCHours().toString().padStart(2, "0");
          const minutes = date.getUTCMinutes().toString().padStart(2, "0");
          const seconds = date.getUTCSeconds().toString().padStart(2, "0");
          if (periodSelection == "day") {
            return `${year}-${month}-${day}`;
          } else {
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          }
        })
      );
      console.log(
        lastData[lastData.length - 1].open,
        lastData[lastData.length - 1].close,
        lastData[lastData.length - 1].low,
        lastData[lastData.length - 1].high
      );
      seriesData = seriesData.concat(
        lastData.map((item) => [
          Number(item.open),
          Number(item.close),
          Number(item.low),
          Number(item.high),
        ])
      );

      let volumeData = klineData.map((item, index) => ({
        value: item.volume,
        itemStyle: {
          color: item.color, // 根据索引获取对应的颜色
        },
      }));

      volumeData = volumeData.concat(
        lastData.map((item) => ({
          value: item.volume,
          itemStyle: {
            color: item.color,
          },
        }))
      );

      const option = {
        xAxis: [
          {
            type: "category",
            data: xAxisData,
            axisLabel: {
              interval: "auto",
              show: false,
              formatter: function (value) {
                return value;
              },
            },
            axisPointer: {
              type: "shadow",
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "rgba(256, 256, 256, 0.1)",
              },
            },
            gridIndex: 0,
          },
          {
            type: "category",
            data: xAxisData,
            axisLabel: {
              interval: "auto",
              show: false,
              formatter: function (value) {
                return value;
              },
            },
            axisPointer: {
              type: "shadow",
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "rgba(256, 256, 256, 0.1)",
              },
            },
            gridIndex: 1,
          },
          {
            type: "category",
            data: xAxisData,
            axisLabel: {
              interval: "auto",
              formatter: function (value) {
                return value;
              },
            },
            axisPointer: {
              type: "shadow",
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "rgba(256, 256, 256, 0.1)",
              },
            },
            gridIndex: 2,
          },
        ],
        yAxis: [
          {
            name: "Price",
            type: "value",
            position: "right",
            min: (yAxisMin - (yAxisMax - yAxisMin) * 0.15).toPrecision(4),
            max: (yAxisMax + (yAxisMax - yAxisMin) * 0.15).toPrecision(4),
            interval: Number(
              (
                (yAxisMax +
                  (yAxisMax - yAxisMin) * 0.15 -
                  (yAxisMin - (yAxisMax - yAxisMin) * 0.15)) /
                4
              ).toPrecision(4)
            ),
            splitLine: {
              show: true,
              lineStyle: {
                color: "rgba(256, 256, 256, 0.2)",
              },
            },
          },
          {
            name: "Volume",
            type: "value",
            position: "right",
            splitLine: {
              show: false,
            },
            axisLabel: {
              formatter: function (value) {
                return formatNumberWithUnit(value);
              },
            },
            gridIndex: 1,
          },
          {
            name: showIndicator,
            type: "value",
            position: "right",
            splitLine: {
              show: false,
            },
            gridIndex: 2,
          },
        ],
        series: [
          {
            type: "candlestick",
            data: seriesData,
            xAxisIndex: 0,
            yAxisIndex: 0,
            gridIndex: 0,
          },
          {
            type: "bar",
            data: volumeData,
            xAxisIndex: 1,
            yAxisIndex: 1,
            gridIndex: 1,
          },
          ...(showIndicator == "MACD"
            ? [
                {
                  type: "bar",
                  data: [
                    ...MACDData.map((item, index) => ({
                      value: item.MACD,
                      itemStyle: {
                        color: item.MACD > 0 ? "#f6465d" : "#0ecb81",
                      },
                    })),
                    ...lastData.map((item, index) => ({
                      value: item.MACD,
                      itemStyle: {
                        color: item.MACD > 0 ? "#f6465d" : "#0ecb81",
                      },
                    })),
                  ],
                  name: "MACD",
                  xAxisIndex: 2,
                  yAxisIndex: 2,
                  gridIndex: 2,
                },
                {
                  type: "line",
                  data: [
                    ...MACDData.map((item) => item.DEA),
                    ...lastData.map((item) => item.DEA),
                  ],
                  lineStyle: {
                    width: 0.98,
                    color: "#fcec60b3",
                  },
                  symbol: "none",
                  xAxisIndex: 2,
                  yAxisIndex: 2,
                  gridIndex: 2,
                },
                {
                  type: "line",
                  data: [
                    ...MACDData.map((item) => item.DIF),
                    ...lastData.map((item) => item.DIF),
                  ],
                  lineStyle: {
                    width: 0.98,
                    color: "#74fcfdb3",
                  },
                  symbol: "none",
                  xAxisIndex: 2,
                  yAxisIndex: 2,
                  gridIndex: 2,
                },
              ]
            : []),
          ...(showIndicator == "KDJ"
            ? [
                {
                  type: "line",
                  data: [
                    ...KDJData.map((item) => item.K),
                    ...lastData.map((item) => item.K),
                  ],
                  lineStyle: {
                    width: 0.98,
                    color: "#f58210",
                  },
                  symbol: "none",
                  xAxisIndex: 2,
                  yAxisIndex: 2,
                  gridIndex: 2,
                },
                {
                  type: "line",
                  data: [
                    ...KDJData.map((item) => item.D),
                    ...lastData.map((item) => item.D),
                  ],
                  lineStyle: {
                    width: 0.98,
                    color: "#fffe55",
                  },
                  symbol: "none",
                  xAxisIndex: 2,
                  yAxisIndex: 2,
                  gridIndex: 2,
                },
                {
                  type: "line",
                  data: [
                    ...KDJData.map((item) => item.J),
                    ...lastData.map((item) => item.J),
                  ],
                  lineStyle: {
                    width: 0.98,
                    color: "#8b2bf6",
                  },
                  symbol: "none",
                  xAxisIndex: 2,
                  yAxisIndex: 2,
                  gridIndex: 2,
                },
              ]
            : []),
          ...(showIndicator == "RSI"
            ? [
                {
                  type: "line",
                  data: [
                    ...RSIData.map((item) => item.RSI_6),
                    ...lastData.map((item) => item.RSI_6),
                  ],
                  lineStyle: {
                    width: 0.98,
                    color: "#f58210",
                  },
                  symbol: "none",
                  xAxisIndex: 2,
                  yAxisIndex: 2,
                  gridIndex: 2,
                },
                {
                  type: "line",
                  data: [
                    ...RSIData.map((item) => item.RSI_12),
                    ...lastData.map((item) => item.RSI_12),
                  ],
                  lineStyle: {
                    width: 0.98,
                    color: "#fffe55",
                  },
                  symbol: "none",
                  xAxisIndex: 2,
                  yAxisIndex: 2,
                  gridIndex: 2,
                },
                {
                  type: "line",
                  data: [
                    ...RSIData.map((item) => item.RSI_24),
                    ...lastData.map((item) => item.RSI_24),
                  ],
                  lineStyle: {
                    width: 0.98,
                    color: "#8b2bf6",
                  },
                  symbol: "none",
                  xAxisIndex: 2,
                  yAxisIndex: 2,
                  gridIndex: 2,
                },
              ]
            : []),
          ...(showIndicator == "WR"
            ? [
                {
                  type: "line",
                  data: [
                    ...WRData.map((item) => item.WilliamsR),
                    ...lastData.map((item) => item.WilliamsR),
                  ],
                  lineStyle: {
                    width: 0.98,
                    color: "#f58210",
                  },
                  symbol: "none",
                  xAxisIndex: 2,
                  yAxisIndex: 2,
                  gridIndex: 2,
                },
              ]
            : []),
          ...(showMA5
            ? [
                {
                  type: "line",
                  data: [
                    ...maData.map((item) => item.MA5),
                    ...lastData.map((item) => item.ma5),
                  ],
                  name: "MA5",
                  smooth: true,
                  symbol: "none",
                  lineStyle: {
                    width: 0.8,
                    color: "#007bff",
                  },
                },
              ]
            : []),
          ...(showMA10
            ? [
                {
                  type: "line",
                  data: [
                    ...maData.map((item) => item.MA10),
                    ...lastData.map((item) => item.ma10),
                  ],
                  name: "MA10",
                  smooth: true,
                  symbol: "none",
                  lineStyle: {
                    width: 0.8,
                    color: "#e83e8c",
                  },
                },
              ]
            : []),
          ...(showMA20
            ? [
                {
                  type: "line",
                  data: [
                    ...maData.map((item) => item.MA20),
                    ...lastData.map((item) => item.ma20),
                  ],
                  name: "MA20",
                  smooth: true,
                  symbol: "none",
                  lineStyle: {
                    width: 0.8,
                    color: "#ffc107",
                  },
                },
              ]
            : []),
          ...(showMA60
            ? [
                {
                  type: "line",
                  data: [
                    ...maData.map((item) => item.MA60),
                    ...lastData.map((item) => item.ma60),
                  ],
                  name: "MA60",
                  smooth: true,
                  symbol: "none",
                  lineStyle: {
                    width: 0.8,
                    color: "#6f42c1",
                  },
                },
              ]
            : []),
          ...(showMA120
            ? [
                {
                  type: "line",
                  data: [
                    ...maData.map((item) => item.MA120),
                    ...lastData.map((item) => item.ma120),
                  ],
                  name: "MA120",
                  smooth: true,
                  symbol: "none",
                  lineStyle: {
                    width: 0.8,
                    color: "#17a2b8",
                  },
                },
              ]
            : []),
          ...(showBoll
            ? [
                {
                  type: "line",
                  data: [
                    ...bollData.map((item) => item.UpperBand),
                    ...lastData.map((item) => item.UpperBand),
                  ],
                  name: "Boll Upper",
                  smooth: true,
                  symbol: "none",
                  lineStyle: {
                    width: 0.98,
                    color: "#fffe",
                  },
                },
                {
                  type: "line",
                  data: [
                    ...bollData.map((item) => item.MiddleBand),
                    ...lastData.map((item) => item.MiddleBand),
                  ],
                  name: "Boll Middle",
                  smooth: true,
                  symbol: "none",
                  lineStyle: {
                    width: 0.98,
                    color: "#fffe",
                  },
                },
                {
                  type: "line",
                  data: [
                    ...bollData.map((item) => item.LowerBand),
                    ...lastData.map((item) => item.LowerBand),
                  ],
                  name: "Boll Lower",
                  smooth: true,
                  symbol: "none",
                  lineStyle: {
                    width: 0.98,
                    color: "#fffe",
                  },
                },
              ]
            : []),
        ],
        grid: [
          {
            left: "5%",
            right: "8%",
            bottom: "41%",
            containLabel: false,
            height: "55%",
          },
          {
            left: "5%",
            right: "8%",
            top: "64%",
            containLabel: false,
            height: "12.5%",
          },
          {
            left: "5%",
            right: "8%",
            top: "82%",
            containLabel: false,
            height: "12.5%",
          },
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          formatter: () => {
            return null;
          },
        },
        dataZoom: [
          {
            type: "inside",
            start: dataZoomStart,
            end: dataZoomEnd,
            minValueSpan: 40,
            maxValueSpan: klineData.length,
            startValue: 0,
            endValue: 120,
            moveOnMouseMove: true,
          },
          {
            type: "inside",
            xAxisIndex: [0, 1],
            start: dataZoomStart,
            end: dataZoomEnd,
            zoomLock: true,
          },
          {
            type: "inside",
            xAxisIndex: [1, 2],
            start: dataZoomStart,
            end: dataZoomEnd,
            zoomLock: true,
          },
        ],
      };

      myChart.setOption(option);

      myChart.on("mousemove", handleMouseMove);
      myChart.on("mouseout", handleMouseOut);
    }
  };

  return (
    <div
      style={{
        // background: "rgba(255, 255, 255, 255)",
        margin: "0.5% 19.1% 0% 19.1%",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          background: "rgba(0, 0, 0, 255)",
          padding: "2% 5% 0 5%",
          color: "rgba(255, 255, 255, 0.75)",
        }}
      >
        <scan>Date: {tooltipData.date}</scan> &nbsp;
        <scan>
          Open:{" "}
          <scan style={{ color: tooltipData.color }}>
            {parseFloat(tooltipData.open)
              .toFixed(8)
              .replace(/\.?0+$/, "")}
          </scan>
        </scan>
        &nbsp;&nbsp;
        <scan>
          Close:{" "}
          <scan style={{ color: tooltipData.color }}>
            {" "}
            {parseFloat(tooltipData.close)
              .toFixed(8)
              .replace(/\.?0+$/, "")}
          </scan>
        </scan>
        &nbsp;&nbsp;
        <scan>
          Low:{" "}
          <scan style={{ color: tooltipData.color }}>
            {" "}
            {parseFloat(tooltipData.low)
              .toFixed(8)
              .replace(/\.?0+$/, "")}
          </scan>
        </scan>
        &nbsp;&nbsp;
        <scan>
          High:{" "}
          <scan style={{ color: tooltipData.color }}>
            {parseFloat(tooltipData.high)
              .toFixed(8)
              .replace(/\.?0+$/, "")}
          </scan>
        </scan>
        &nbsp;&nbsp;
        <scan>
          Change:{" "}
          <scan style={{ color: tooltipData.color }}>
            {Number(tooltipData.Increase).toFixed(2) + "%"}
          </scan>
        </scan>
        &nbsp;&nbsp;
        <scan>
          Amplitude:{" "}
          <scan style={{ color: tooltipData.color }}>
            {Number(tooltipData.Amplitude).toFixed(2) + "%"}
          </scan>
        </scan>
      </div>
      <div
        style={{
          background: "rgba(0, 0, 0, 255)",
          padding: "0 5% 0 5%",
          color: "rgba(255, 255, 255, 0.75)",
        }}
      >
        <scan>
          {" "}
          MA(5):{" "}
          <scan style={{ color: "#007bff" }}>
            {parseFloat(maShowData.MA5)
              .toFixed(8)
              .replace(/\.?0+$/, "")}
          </scan>
        </scan>
        &nbsp;&nbsp;
        <scan>
          {" "}
          MA(10):{" "}
          <scan style={{ color: "#e83e8c" }}>
            {parseFloat(maShowData.MA10)
              .toFixed(8)
              .replace(/\.?0+$/, "")}
          </scan>
        </scan>
        &nbsp;&nbsp;
        <scan>
          {" "}
          MA(20):{" "}
          <scan style={{ color: "#ffc107" }}>
            {parseFloat(maShowData.MA20)
              .toFixed(8)
              .replace(/\.?0+$/, "")}
          </scan>
        </scan>
        &nbsp;&nbsp;
        <scan>
          {" "}
          MA(60):{" "}
          <scan style={{ color: "#6f42c1" }}>
            {parseFloat(maShowData.MA60)
              .toFixed(8)
              .replace(/\.?0+$/, "")}
          </scan>
        </scan>
        &nbsp;&nbsp;
        <scan>
          {" "}
          MA(120):{" "}
          <scan style={{ color: "#17a2b8" }}>
            {parseFloat(maShowData.MA120)
              .toFixed(8)
              .replace(/\.?0+$/, "")}
          </scan>
        </scan>
      </div>
      <div
        style={{
          background: "rgba(0, 0, 0, 255)",
          padding: "0 5% 0 5%",
          color: "rgba(255, 255, 255, 0.75)",
        }}
      >
        <scan>
          {" "}
          Boll(20,2) UP:{" "}
          <scan style={{ color: "#f582e0" }}>
            {parseFloat(bollShowData.UpperBand)
              .toFixed(8)
              .replace(/\.?0+$/, "")}
          </scan>
        </scan>
        &nbsp;&nbsp;
        <scan>
          {" "}
          MB:{" "}
          <scan style={{ color: "#f582e0" }}>
            {parseFloat(bollShowData.MiddleBand)
              .toFixed(8)
              .replace(/\.?0+$/, "")}
          </scan>
        </scan>
        &nbsp;&nbsp;
        <scan>
          {" "}
          DN:{" "}
          <scan style={{ color: "#f582e0" }}>
            {parseFloat(bollShowData.LowerBand)
              .toFixed(8)
              .replace(/\.?0+$/, "")}
          </scan>
        </scan>
        &nbsp;&nbsp;
        <scan>
          {" "}
          Vol(CHZ):{" "}
          <scan style={{ color: tooltipData.color }}>
            {parseFloat(tooltipData.volume).toFixed(2)}
          </scan>
        </scan>
        &nbsp;&nbsp;
        <scan>
          {" "}
          Vol(USDT):{" "}
          <scan style={{ color: tooltipData.color }}>
            {parseFloat(tooltipData.quote_volume).toFixed(2)}
          </scan>
        </scan>
      </div>
      <div
        style={{
          background: "rgba(0, 0, 0, 255)",
          padding: "0 5% 0 5%",
          color: "rgba(255, 255, 255, 0.75)",
        }}
      >
        <scan>
          {" "}
          WR(14):{" "}
          <scan style={{ color: "#f58210" }}>
            {parseFloat(WRShowData.WilliamsR).toFixed(4)}
          </scan>
        </scan>
        &nbsp;&nbsp;
        <scan>
          {" "}
          MACD(12,26,9) DEA:{" "}
          <scan style={{ color: "#fcec60b3" }}>
            {parseFloat(MACDShowData.DEA).toFixed(4)}
          </scan>
        </scan>
        &nbsp;&nbsp;
        <scan>
          {" "}
          DIF:{" "}
          <scan style={{ color: "#74fcfdb3" }}>
            {parseFloat(MACDShowData.DIF).toFixed(4)}
          </scan>
        </scan>
        &nbsp;&nbsp;
        <scan>
          {" "}
          MACD:{" "}
          <scan
            style={{ color: MACDShowData.MACD > 0 ? "#f6465d" : "#0ecb81" }}
          >
            {parseFloat(MACDShowData.MACD).toFixed(4)}
          </scan>
        </scan>
      </div>
      <div
        style={{
          background: "rgba(0, 0, 0, 255)",
          padding: "0 5% 0 5%",
          color: "rgba(255, 255, 255, 0.75)",
        }}
      >
        <scan>
          {" "}
          KDJ(9,3,3) K:{" "}
          <scan style={{ color: "#f58210" }}>
            {parseFloat(KDJShowData.K).toFixed(4)}
          </scan>
        </scan>
        &nbsp;&nbsp;
        <scan>
          {" "}
          D:{""}
          <scan style={{ color: "#fffe55" }}>
            {parseFloat(KDJShowData.D).toFixed(4)}
          </scan>
        </scan>
        &nbsp;&nbsp;
        <scan>
          {" "}
          J:{" "}
          <scan style={{ color: "#8b2bf6" }}>
            {parseFloat(KDJShowData.J).toFixed(4)}
          </scan>
        </scan>
        &nbsp;&nbsp;
        <scan>
          {" "}
          RSI(6,12,24) RSI(6):{" "}
          <scan style={{ color: "#f58210" }}>
            {parseFloat(RSIShowData.RSI_6).toFixed(4)}
          </scan>
        </scan>
        &nbsp;&nbsp;
        <scan>
          {" "}
          RSI(12):{" "}
          <scan style={{ color: "#fffe55" }}>
            {parseFloat(RSIShowData.RSI_12).toFixed(4)}
          </scan>
        </scan>
        &nbsp;&nbsp;
        <scan>
          {" "}
          RSI(24):{" "}
          <scan style={{ color: "#8b2bf6" }}>
            {parseFloat(RSIShowData.RSI_24).toFixed(4)}
          </scan>
        </scan>
      </div>
      <div
        className="period-button-container"
        style={{
          background: "rgba(0, 0, 0, 255)",
          color: "rgba(255, 255, 255, 0.75)",
          padding: "2% 5% 0 5%",
        }}
      >
        <button
          className="period-button"
          onClick={() => setPeriodSelection("fiveminute")}
          disabled={loading}
        >
          5m
        </button>
        <button
          className="period-button"
          onClick={() => setPeriodSelection("fifteenminute")}
          disabled={loading}
        >
          15m
        </button>
        <button
          className="period-button"
          onClick={() => setPeriodSelection("onehour")}
          disabled={loading}
        >
          1H
        </button>
        <button
          className="period-button"
          onClick={() => setPeriodSelection("fourhour")}
          disabled={loading}
        >
          4H
        </button>
        <button
          className="period-button"
          onClick={() => setPeriodSelection("twelvehour")}
          disabled={loading}
        >
          12H
        </button>
        <button
          className="period-button"
          onClick={() => setPeriodSelection("day")}
          disabled={loading}
        >
          1D
        </button>
        <button
          className="indicator-button"
          onClick={() => setShowIndicator("MACD")}
          disabled={loading}
        >
          MACD
        </button>
        <button
          className="indicator-button"
          onClick={() => setShowIndicator("KDJ")}
          disabled={loading}
        >
          KDJ
        </button>
        <button
          className="indicator-button"
          onClick={() => setShowIndicator("RSI")}
          disabled={loading}
        >
          RSI
        </button>
        <button
          className="indicator-button"
          onClick={() => setShowIndicator("WR")}
          disabled={loading}
        >
          WR
        </button>
      </div>
      {
        <div
          id="klineChart"
          style={{
            height: "720px",
            position: "relative",
            background: "rgba(0, 0, 0, 255)",
          }}
        ></div>
      }
    </div>
  );
};

export default KChart;
