import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import {
  SharpeRatio_image,
  AlphaCoef_image,
  BetaCoef_image,
  MaxDraw_image,
  Macd_image,
  Boll_image,
  Volume_image,
  MarketCap_image,
  HistoryScore_image,
} from "../assets";

const HistoryMark = ({ SelectedAsset }) => {
  const HistoryMarkChartRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historyMarkData, setHistoryMarkData] = useState({
    SharpeRatio: [0, 0, 0],
    BetaCoef: [0, 0, 0],
    AlphaCoef: [0, 0, 0],
    MaxDraw: [0, 0, 0],
    Macd: [0, 0, 0],
    Boll: [0, 0, 0],
    Volume: [0, 0, 0],
    MarketCap: [0, 0, 0],
  });
  const [formulaData, setFormulaData] = useState([]);
  const [showIndicator, setShowIndicator] = useState("");

  useEffect(() => {
    if (SelectedAsset == "" || SelectedAsset == null) {
      return;
    }
    console.log("aaaaaaaaaaaaaaa");
    console.log(SelectedAsset);
    console.log("aaaaaaaaaaaaaaa");
    fetchHistoryMark(SelectedAsset);
  }, [SelectedAsset]);

  useEffect(() => {
    if (formulaData.length == 0) {
      return;
    }
    setIsModalOpen(true);
  }, [formulaData]);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }
    if (HistoryMarkChartRef.current) {
      HistoryMarkChartRef.current.dispose();
    }
    const newChartDom = document.getElementById("HistoryMarkChart");
    if (newChartDom) {
      const newHistoryMarkChart = echarts.init(newChartDom);
      console.log(formulaData);
      const mapData = [
        {
          x: historyMarkData[`${showIndicator}`][0],
          y: historyMarkData[`${showIndicator}`][1],
        },
      ];
      console.log(mapData);
      const option = {
        xAxis: {
          type:
            showIndicator === "Volume" || showIndicator === "MarketCap"
              ? "log"
              : "value",
          name: showIndicator,
          max:
            showIndicator === "Volume"
              ? 1.0e12
              : showIndicator === "MarketCap"
              ? 1.0e15
              : undefined,
          splitNumber:
            showIndicator === "Volume"
              ? 12
              : showIndicator === "MarketCap"
              ? 15
              : undefined,
          axisLabel: {
            formatter: function (value) {
              return showIndicator === "Volume" || showIndicator === "MarketCap"
                ? value.toExponential(2)
                : value;
            },
          },
        },
        yAxis: {
          type: "value",
          name: "score",
          axisLabel: {
            formatter: function (value) {
              return value.toFixed(2);
            },
          },
        },
        series: [
          {
            name: `${showIndicator} Formula`,
            type: "line",
            data: formulaData.map((item) => [item.x, item.y]),
            color: "white",
            symbolSize: 4,
          },
          {
            name: `${showIndicator}`,
            type: "scatter",
            data: [
              {
                value: [mapData[0].x, mapData[0].y],
              },
            ],
            color: "red",
            symbol:
              "path://M 200 200 l-40 100 100 -80 -120 0 100 80 -40 -120 -40 120z",
            symbolSize: 50,
            z: 666,
          },
        ],
        grid: {
          left: "5%",
          right: "5%",
          top: "9%",
          bottom: "10%",
          containLabel: false,
        },
        tooltip: {
          formatter: function (params) {
            if (params.seriesName == `${showIndicator} Formula`) {
              console.log(showIndicator);
              console.log(params.value[0]);
              return `${showIndicator} : ${params.value[0]}<br/>Score : ${params.value[1]}`;
            } else if (params.seriesName == `${showIndicator}`) {
              return `${showIndicator} : ${params.value[0]}<br/>Score : ${params.value[1]}`;
            }
          },
        },
      };

      newHistoryMarkChart.setOption(option);
      HistoryMarkChartRef.current = newHistoryMarkChart;
    }
  }, [isModalOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
    setFormulaData([]);
  };

  const getAllScore = (Score) => {
    let sum = 0;
    Object.values(Score).forEach((array) => {
      sum += array[1];
    });
    sum += 0.05;
    return sum.toFixed(2);
  };

  const getScoreColor = (Score) => {
    let color = "";
    if (Score >= 32) {
      color = "#0ecb81";
    } else if (Score >= 25 && Score < 32) {
      color = "#74fcfdb3";
    } else if (Score >= 18 && Score < 25) {
      color = "#fffe55";
    } else {
      color = "#f6465d";
    }
    return color;
  };

  const getLevel = (Score) => {
    let level = "";
    if (Score >= 32) {
      level = "A";
    } else if (Score >= 25 && Score < 32) {
      level = "B";
    } else if (Score >= 18 && Score < 25) {
      level = "C";
    } else {
      level = "D";
    }
    return level;
  };

  const fetchHistoryMark = () => {
    fetch(`http://127.0.0.1:5000/history?asset=${SelectedAsset}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("ssssssssssssssssssssssssssssssssssssssssss");
        console.log(data);
        console.log("ssssssssssssssssssssssssssssssssssssssssss");
        setHistoryMarkData({
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
        });
      })
      .catch((error) => console.error("Error fetching :", error));
  };

  const fetchFormula = (indicator) => {
    fetch(`http://127.0.0.1:5000/formula?indicator=${indicator}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("ssssssssssssssssssssssssssssssssssssssssss");
        console.log(data);
        console.log("ssssssssssssssssssssssssssssssssssssssssss");
        setFormulaData(data);
        setShowIndicator(indicator);
      })
      .catch((error) => console.error("Error fetching :", error));
  };

  const formatNumberToScientificNotation = (number) => {
    const exponent = Math.floor(Math.log10(Math.abs(number)));
    const coefficient = number / Math.pow(10, exponent);
    console.log(coefficient);
    return `${coefficient.toFixed(2)}e${exponent}`;
  };

  return (
    <div className="basic-chart">
      <div
        className="chart-container middle-container"
        style={{ width: "100%", margin: "0 1% 0 1.75%", fontSize: "14px" }}
      >
        <h1 className="chart-title">History Score ({SelectedAsset})</h1>
        <table className="history-mark-table">
          <thead>
            <tr>
              <th>Indicator</th>
              <th>Value</th>
              <th>Score</th>
              <th>Scheme</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(historyMarkData).map(([key, value]) => (
              <tr key={key}>
                <td style={{ color: "#fffe55" }}>{key}</td>
                {(key == "Volume" || key == "MarketCap") && <td>{value[0]}</td>}
                {key != "Volume" && key != "MarketCap" && (
                  <td>{Number(value[0]).toFixed(2)}</td>
                )}
                <td>
                  {Number(value[1]).toFixed(2)} / {Number(value[2])}
                </td>
                <td>
                  <button
                    className="show-button"
                    onClick={() => fetchFormula(key)}
                  >
                    Show
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "3% 5% 2% 5%",
            fontSize: "18px",
          }}
        >
          <span>
            Score :{" "}
            <span
              style={{ color: getScoreColor(getAllScore(historyMarkData)) }}
            >
              {getAllScore(historyMarkData)}
            </span>{" "}
            / <span style={{ color: "#007bff" }}>50.00</span>
          </span>
          <span>
            Level :{" "}
            <span
              style={{ color: getScoreColor(getAllScore(historyMarkData)) }}
            >
              {getLevel(getAllScore(historyMarkData))}
            </span>
          </span>
        </div>
        <div>
          <img src={HistoryScore_image} />
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlay-B select-title">
          <div className="modal-B">
            <span className="modal-close-B" onClick={closeModal}>
              x
            </span>
            <div style={{ fontSize: "22px", margin: "2% 0 0 0" }}>
              {showIndicator} Formula
            </div>
            <br />
            <div className="image-container-indicator">
              {showIndicator === "SharpeRatio" && (
                <img src={SharpeRatio_image} />
              )}
              {showIndicator === "AlphaCoef" && <img src={AlphaCoef_image} />}
              {showIndicator === "BetaCoef" && <img src={BetaCoef_image} />}
              {showIndicator === "MaxDraw" && <img src={MaxDraw_image} />}
              {showIndicator === "Macd" && <img src={Macd_image} />}
              {showIndicator === "Boll" && <img src={Boll_image} />}
              {showIndicator === "Volume" && <img src={Volume_image} />}
              {showIndicator === "MarketCap" && <img src={MarketCap_image} />}
            </div>
            <div
              id="HistoryMarkChart"
              style={{ width: "100%", height: "480px" }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryMark;
