import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

const MultiMark = ({ Assets }) => {
  const MultiChartRef = useRef(null);
  const HistoryChartRef = useRef(null);
  const [selectedPeriod, setSelectedPeriod] = useState("1d");
  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00"];
  const [MarkData, setMarkData] = useState([
    {
      Asset: "",
      "MA(5,10,20,60,120)": [[], 10],
      "MAVOL(5,10,20,60,120)": [[], 10],
      "BOLL(20,2)": [[], 10],
      "MACD(12,26,9)": [[], 10],
      "KDJ(9,3,3)": [[], 10],
      "RSI(6,12,24)": [[], 10],
      All: "",
    },
  ]);
  const [HistoryData, setHistoryData] = useState([
    {
      Asset: "",
      SharpeRatio: [0, 0, 0],
      BetaCoef: [0, 0, 0],
      AlphaCoef: [0, 0, 0],
      MaxDraw: [0, 0, 0],
      Macd: [0, 0, 0],
      Boll: [0, 0, 0],
      Volume: [0, 0, 0],
      MarketCap: [0, 0, 0],
      All: "",
    },
  ]);

  useEffect(() => {
    if (Assets && Assets.length > 0) {
      let allAssetsHaveName = true;
      for (let i = 0; i < Assets.length; i++) {
        const asset = Assets[i];
        if (!asset.name) {
          allAssetsHaveName = false;
          break;
        }
      }
      if (allAssetsHaveName) {
        fetchMultiMark(Assets, selectedPeriod);
      }
    }
  }, [Assets, selectedPeriod]);

  useEffect(() => {
    if (Assets && Assets.length > 0) {
      let allAssetsHaveName = true;
      for (let i = 0; i < Assets.length; i++) {
        const asset = Assets[i];
        if (!asset.name) {
          allAssetsHaveName = false;
          break;
        }
      }
      if (allAssetsHaveName) {
        fetchMultiHistoryMark(Assets);
      }
    }
  }, [Assets]);

  useEffect(() => {
    MultiMarkChart(MarkData);
  }, [MarkData]);

  useEffect(() => {
    MultiHistoryChart(HistoryData);
  }, [HistoryData]);

  const fetchMultiMark = async (assets, period) => {
    try {
      // 创建一个 Promise 数组，每个元素代表一个资产的请求
      const promises = assets.map((asset) =>
        fetchAssetMark(asset.name, period)
      );
      // 使用 Promise.all 等待所有请求完成
      const results = await Promise.all(promises);
      console.log("ooooooooooooooooooooooooooooooooooooooooo");
      console.log(results); // 所有资产的结果数组
      console.log("ooooooooooooooooooooooooooooooooooooooooo");
      const concatenatedResults = results.reduce(
        (acc, curr) => acc.concat(curr),
        []
      );
      console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
      console.log(concatenatedResults); // 拼接后的结果数组
      console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
      setMarkData(concatenatedResults);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  const fetchMultiHistoryMark = async (assets) => {
    try {
      // 创建一个 Promise 数组，每个元素代表一个资产的请求
      const promises = assets.map((asset) => fetchHistoryMark(asset.name));
      // 使用 Promise.all 等待所有请求完成
      const results = await Promise.all(promises);
      console.log("ooooooooooooooooooooooooooooooooooooooooo");
      console.log(results); // 所有资产的结果数组
      console.log("ooooooooooooooooooooooooooooooooooooooooo");
      const concatenatedResults = results.reduce(
        (acc, curr) => acc.concat(curr),
        []
      );
      console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
      console.log(concatenatedResults); // 拼接后的结果数组
      console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
      setHistoryData(concatenatedResults);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  const fetchAssetMark = (asset, period) => {
    // 返回一个 Promise 对象，以便在调用处等待数据加载完毕
    return new Promise((resolve, reject) => {
      fetch(`http://127.0.0.1:5000/mark${period}?asset=${asset}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("ssssssssssssssssssssssssssssssssssssssssss");
          console.log(data);
          console.log("ssssssssssssssssssssssssssssssssssssssssss");
          resolve({
            Asset: asset,
            "MA(5,10,20,60,120)": [data.MA[0], 10],
            "MAVOL(5,10,20,60,120)": [data.MAVOL[0], 10],
            "BOLL(20,2)": [data.BOLL[0], 10],
            "MACD(12,26,9)": [data.MACD[0], 10],
            "KDJ(9,3,3)": [data.KDJ[0], 10],
            "RSI(6,12,24)": [data.RSI[0], 10],
            All:
              data.MA[0]["MA(5,10,20,60,120)"] +
              data.MAVOL[0]["MAVOL(5,10,20,60,120)"] +
              data.BOLL[0]["BOLL(20,2)"] +
              data.MACD[0]["MACD(12,26,9)"] +
              data.KDJ[0]["KDJ(9,3,3)"] +
              data.RSI[0]["RSI(6,12,24)"],
          });
        })
        .catch((error) => {
          console.error("Error fetching :", error);
          reject(error); // 如果发生错误，将错误传递给调用者
        });
    });
  };

  const fetchHistoryMark = (asset) => {
    // 返回一个 Promise 对象，以便在调用处等待数据加载完毕
    return new Promise((resolve, reject) => {
      fetch(`http://127.0.0.1:5000/history?asset=${asset}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("ssssssssssssssssssssssssssssssssssssssssss");
          console.log(data);
          console.log("ssssssssssssssssssssssssssssssssssssssssss");
          resolve({
            Asset: asset,
            SharpeRatio: data.SharpeRatio,
            BetaCoef: data.BetaCoef,
            AlphaCoef: data.AlphaCoef,
            MaxDraw: data.MaxDraw,
            Macd: data.Macd,
            Boll: data.Boll,
            Volume: [
              formatNumberToScientificNotation(data.Volume[0]),
              data.Volume[1],
              data.Volume[2],
            ],
            MarketCap: [
              formatNumberToScientificNotation(data.MarketCap[0]),
              data.MarketCap[1],
              data.MarketCap[2],
            ],
            All:
              data.SharpeRatio[1] +
              data.BetaCoef[1] +
              data.AlphaCoef[1] +
              data.MaxDraw[1] +
              data.Macd[1] +
              data.Boll[1] +
              data.Volume[1] +
              data.MarketCap[1],
          });
        })
        .catch((error) => {
          console.error("Error fetching :", error);
          reject(error); // 如果发生错误，将错误传递给调用者
        });
    });
  };

  const formatNumberToScientificNotation = (number) => {
    const exponent = Math.floor(Math.log10(Math.abs(number)));
    const coefficient = number / Math.pow(10, exponent);
    console.log(coefficient);
    return `${coefficient.toFixed(2)}e${exponent}`;
  };

  const MultiMarkChart = (data) => {
    if (MultiChartRef.current) {
      MultiChartRef.current.dispose();
    }

    const newChartDom = document.getElementById("MultiChart");
    const newMultiChart = echarts.init(newChartDom);

    if (data.length === 0) {
      return;
    }

    const xlabel = data.map((item) => item.Asset);

    const option = {
      xAxis: {
        type: "category",
        data: xlabel,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: data.map((item) => item.All),
          type: "bar",
          itemStyle: {
            color: function (params) {
              return colors[params.dataIndex];
            },
          },
          barWidth: "38%",
          label: {
            show: true,
            position: "top",
            formatter: function (params) {
              return Number(params.value).toFixed(2);
            },
          },
        },
      ],
      grid: {
        left: "8%",
        right: "8%",
        top: "10%",
        bottom: "6%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis", // 设置触发类型为 axis，表示鼠标悬停在轴上时显示 Tooltip
        axisPointer: {
          type: "shadow", // 设置指示器为阴影，即跟随柱子的阴影
        },
        formatter: function (params) {
          const dataIndex = params[0].dataIndex;
          const asset = Assets[dataIndex];
          // const marketValue = formatMV(params[0].data);
          const MA =
            MarkData[dataIndex]["MA(5,10,20,60,120)"][0]["MA(5,10,20,60,120)"];
          const MAVOL =
            MarkData[dataIndex]["MAVOL(5,10,20,60,120)"][0][
              "MAVOL(5,10,20,60,120)"
            ];
          const BOLL = MarkData[dataIndex]["BOLL(20,2)"][0]["BOLL(20,2)"];
          const MACD = MarkData[dataIndex]["MACD(12,26,9)"][0]["MACD(12,26,9)"];
          const KDJ = MarkData[dataIndex]["KDJ(9,3,3)"][0]["KDJ(9,3,3)"];
          const RSI = MarkData[dataIndex]["RSI(6,12,24)"][0]["RSI(6,12,24)"];

          // 自定义 Tooltip 的显示内容
          return `
              <div style="text-align: center; max-width: 100%; margin: 0 auto; font-size: 1em;">
                  <div style="margin-top: 0%;">
                      <span style="font-size: 18px;">Name : ${asset.name}</span>
                  </div>
                  <div style="margin-top: 4%;">
                      <span style="font-size: 15px;">MA-Score : ${Number(
                        MA
                      ).toFixed(2)}</span>
                  </div>
                  <div style="margin-top: 4%;">
                      <span style="font-size: 15px;">MAVOL-Score : ${Number(
                        MAVOL
                      ).toFixed(2)}</span>
                  </div>
                  <div style="margin-top: 4%;">
                      <span style="font-size: 15px;">BOLL-Score : ${Number(
                        BOLL
                      ).toFixed(2)}</span>
                  </div>
                  <div style="margin-top: 4%;">
                      <span style="font-size: 15px;">MACD-Score : ${Number(
                        MACD
                      ).toFixed(2)}</span>
                  </div>
                  <div style="margin-top: 4%;">
                      <span style="font-size: 15px;">KDJ-Score : ${Number(
                        KDJ
                      ).toFixed(2)}</span>
                  </div>
                  <div style="margin-top: 4%;">
                      <span style="font-size: 15px;">RSI-Score : ${Number(
                        RSI
                      ).toFixed(2)}</span>
                  </div>
              </div>
            `;
        },
      },
    };
    newMultiChart.setOption(option);
    MultiChartRef.current = newMultiChart;
  };

  const MultiHistoryChart = (data) => {
    if (HistoryChartRef.current) {
      HistoryChartRef.current.dispose();
    }

    const newChartDom = document.getElementById("HistoryChart");
    const newHistoryChart = echarts.init(newChartDom);

    if (data.length === 0) {
      return;
    }

    const xlabel = data.map((item) => item.Asset);

    const option = {
      xAxis: {
        type: "category",
        data: xlabel,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: data.map((item) => item.All),
          type: "bar",
          itemStyle: {
            color: function (params) {
              return colors[params.dataIndex];
            },
          },
          barWidth: "38%",
          label: {
            show: true,
            position: "top",
            formatter: function (params) {
              return Number(params.value).toFixed(2);
            },
          },
        },
      ],
      grid: {
        left: "8%",
        right: "8%",
        top: "10%",
        bottom: "6%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis", // 设置触发类型为 axis，表示鼠标悬停在轴上时显示 Tooltip
        axisPointer: {
          type: "shadow", // 设置指示器为阴影，即跟随柱子的阴影
        },
        formatter: function (params) {
          const dataIndex = params[0].dataIndex;
          const asset = Assets[dataIndex];
          const SharpeRatio = HistoryData[dataIndex].SharpeRatio[1];
          const BetaCoef = HistoryData[dataIndex].BetaCoef[1];
          const AlphaCoef = HistoryData[dataIndex].AlphaCoef[1];
          const MaxDraw = HistoryData[dataIndex].MaxDraw[1];
          const Macd = HistoryData[dataIndex].Macd[1];
          const Boll = HistoryData[dataIndex].Boll[1];
          const Volume = HistoryData[dataIndex].Volume[1];
          const MarketCap = HistoryData[dataIndex].MarketCap[1];

          // 自定义 Tooltip 的显示内容
          return `
              <div style="text-align: center; max-width: 100%; margin: 0 auto; font-size: 1em;">
                  <div style="margin-top: 0%;">
                      <span style="font-size: 18px;">Name : ${asset.name}</span>
                  </div>
                  <div style="margin-top: 4%;">
                      <span style="font-size: 15px;">SharpeRatio-Score : ${Number(
                        SharpeRatio
                      ).toFixed(2)}</span>
                  </div>
                  <div style="margin-top: 4%;">
                      <span style="font-size: 15px;">AlphaCoef-Score : ${Number(
                        AlphaCoef
                      ).toFixed(2)}</span>
                  </div>
                  <div style="margin-top: 4%;">
                      <span style="font-size: 15px;">BetaCoef-Score : ${Number(
                        BetaCoef
                      ).toFixed(2)}</span>
                  </div>
                  <div style="margin-top: 4%;">
                      <span style="font-size: 15px;">MaxDraw-Score : ${Number(
                        MaxDraw
                      ).toFixed(2)}</span>
                  </div>
                  <div style="margin-top: 4%;">
                      <span style="font-size: 15px;">Macd-Score : ${Number(
                        Macd
                      ).toFixed(2)}</span>
                  </div>
                  <div style="margin-top: 4%;">
                      <span style="font-size: 15px;">Boll-Score : ${Number(
                        Boll
                      ).toFixed(2)}</span>
                  </div>
                  <div style="margin-top: 4%;">
                      <span style="font-size: 15px;">Volume-Score : ${Number(
                        Volume
                      ).toFixed(2)}</span>
                  </div>
                  <div style="margin-top: 4%;">
                      <span style="font-size: 15px;">MarketCap-Score : ${Number(
                        MarketCap
                      ).toFixed(2)}</span>
                  </div>
              </div>
            `;
        },
      },
    };
    newHistoryChart.setOption(option);
    HistoryChartRef.current = newHistoryChart;
  };

  return (
    <div className="basic-chart">
      <div
        className="chart-container middle-container"
        style={{ width: "100%", margin: "0 1% 0 1.25%", fontSize: "14px" }}
      >
        <h1 className="chart-title">Compare Period Score ({selectedPeriod})</h1>
        <div
          className="period-score-button-container"
          style={{ padding: "1% 5% 1% 5%", fontSize: "16px" }}
        >
          {["15m", "1h", "4h", "1d"].map((period) => (
            <button
              key={period}
              className="period-score-button"
              onClick={() => setSelectedPeriod(period.toLowerCase())}
            >
              {period}
            </button>
          ))}
        </div>
        <div id="MultiChart" style={{ width: "100%", height: "275px" }}></div>
        <h1 className="chart-title">Compare History Score</h1>
        <div id="HistoryChart" style={{ width: "100%", height: "275px" }}></div>
      </div>
    </div>
  );
};

export default MultiMark;
