import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import {
  PeriodScore_image,
} from "../assets";
import { Info } from ".";

const PresentMark = ({ SelectedAsset }) => {
  const MarkChartRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("1d");
  const [MarkData, setMarkData] = useState({
    "MA(5,10,20,60,120)": [[], 10],
    "MAVOL(5,10,20,60,120)": [[], 10],
    "BOLL(20,2)": [[], 10],
    "MACD(12,26,9)": [[], 10],
    "KDJ(9,3,3)": [[], 10],
    "RSI(6,12,24)": [[], 10],
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
    fetchMark(SelectedAsset, selectedPeriod);
  }, [SelectedAsset, selectedPeriod]);

  useEffect(() => {
    if (formulaData.length == 0) {
      return;
    }
    setIsModalOpen(true);
  }, [formulaData]);

  // useEffect(() => {
  //   if (!isModalOpen) {
  //     return;
  //   }
  //   if (HistoryMarkChartRef.current) {
  //     HistoryMarkChartRef.current.dispose();
  //   }
  //   const newChartDom = document.getElementById("HistoryMarkChart");
  //   if (newChartDom) {
  //     const newHistoryMarkChart = echarts.init(newChartDom);
  //     console.log(formulaData);
  //     const mapData = [
  //       {
  //         x: MarkData[`${showIndicator}`][0],
  //         y: MarkData[`${showIndicator}`][1],
  //       },
  //     ];
  //     console.log(mapData);
  //     const option = {
  //       xAxis: {
  //         type:
  //           showIndicator === "Volume" || showIndicator === "MarketCap"
  //             ? "log"
  //             : "value",
  //         name: showIndicator,
  //         max:
  //           showIndicator === "Volume"
  //             ? 1.0e12
  //             : showIndicator === "MarketCap"
  //             ? 1.0e15
  //             : undefined,
  //         splitNumber:
  //           showIndicator === "Volume"
  //             ? 12
  //             : showIndicator === "MarketCap"
  //             ? 15
  //             : undefined,
  //         axisLabel: {
  //           formatter: function (value) {
  //             return showIndicator === "Volume" || showIndicator === "MarketCap"
  //               ? value.toExponential(2)
  //               : value;
  //           },
  //         },
  //       },
  //       yAxis: {
  //         type: "value",
  //         name: "score",
  //         axisLabel: {
  //           formatter: function (value) {
  //             return value.toFixed(2);
  //           },
  //         },
  //       },
  //       series: [
  //         {
  //           name: `${showIndicator} Formula`,
  //           type: "line",
  //           data: formulaData.map((item) => [item.x, item.y]),
  //           color: "white",
  //           symbolSize: 4,
  //         },
  //         {
  //           name: `${showIndicator}`,
  //           type: "scatter",
  //           data: [
  //             {
  //               value: [mapData[0].x, mapData[0].y],
  //             },
  //           ],
  //           color: "red",
  //           symbol:
  //             "path://M 200 200 l-40 100 100 -80 -120 0 100 80 -40 -120 -40 120z",
  //           symbolSize: 50,
  //           z: 666,
  //         },
  //       ],
  //       grid: {
  //         left: "5%",
  //         right: "5%",
  //         top: "9%",
  //         bottom: "10%",
  //         containLabel: false,
  //       },
  //       tooltip: {
  //         formatter: function (params) {
  //           if (params.seriesName == `${showIndicator} Formula`) {
  //             console.log(showIndicator);
  //             console.log(params.value[0]);
  //             return `${showIndicator} : ${params.value[0]}<br/>Score : ${params.value[1]}`;
  //           } else if (params.seriesName == `${showIndicator}`) {
  //             return `${showIndicator} : ${params.value[0]}<br/>Score : ${params.value[1]}`;
  //           }
  //         },
  //       },
  //     };

  //     newHistoryMarkChart.setOption(option);
  //     HistoryMarkChartRef.current = newHistoryMarkChart;
  //   }
  // }, [isModalOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
    setFormulaData([]);
  };

  const getAllScore = (mark_data) => {
    let sum = 0;
    Object.keys(mark_data).reduce((acc, key) => {
      sum += mark_data[key][0][`${key}`];
    }, 0);
    return sum.toFixed(2);
  };

  const getScoreColor = (Score) => {
    let color = "";
    if (Score >= 38) {
      color = "#0ecb81";
    } else if (Score >= 33 && Score < 38) {
      color = "#74fcfdb3";
    } else if (Score >= 27 && Score < 33) {
      color = "#fffe55";
    } else if (Score >= 22 && Score < 27) {
      color = "#f58210";
    } else {
      color = "#f6465d";
    }
    return color;
  };

  const getLevel = (Score) => {
    let level = "";
    if (Score >= 38) {
      level = "A";
    } else if (Score >= 33 && Score < 38) {
      level = "B";
    } else if (Score >= 27 && Score < 33) {
      level = "C";
    } else if (Score >= 22 && Score < 27) {
      level = "D";
    } else {
      level = "E";
    }
    return level;
  };

  const fetchMark = (Asset, Period) => {
    fetch(`http://127.0.0.1:5000/mark${Period}?asset=${Asset}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("ssssssssssssssssssssssssssssssssssssssssss");
        console.log(data);
        console.log("ssssssssssssssssssssssssssssssssssssssssss");
        setMarkData({
          "MA(5,10,20,60,120)": [data.MA[0], 10],
          "MAVOL(5,10,20,60,120)": [data.MAVOL[0], 10],
          "BOLL(20,2)": [data.BOLL[0], 10],
          "MACD(12,26,9)": [data.MACD[0], 10],
          "KDJ(9,3,3)": [data.KDJ[0], 10],
          "RSI(6,12,24)": [data.RSI[0], 10],
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
        style={{ width: "100%", margin: "0 1% 0 1.25%", fontSize: "14px" }}
      >
        <h1 className="chart-title">
          Period Score ({SelectedAsset} / {selectedPeriod})
        </h1>
        <div
          className="period-score-button-container"
          style={{ padding: "1% 5% 0% 5%", fontSize:"16px" }}
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

        <table className="history-mark-table">
          <thead>
            <tr>
              <th>Indicator</th>
              <th>Score</th>
              <th>Scheme</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(MarkData).map(([key, value]) => (
              <tr key={key}>
                <td style={{ color: "#fffe55" }}>{key}</td>
                <td>
                  {Number(value[0][`${key}`]).toFixed(2)} / {value[1]}
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
            margin: "2% 5% 1.8% 5%",
            fontSize: "18px",
          }}
        >
          <span>
            Score :{" "}
            <span style={{ color: getScoreColor(getAllScore(MarkData)) }}>
              {getAllScore(MarkData)}
            </span>{" "}
            / <span style={{ color: "#007bff" }}>60.00</span>
          </span>
          <span>
            Level :{" "}
            <span style={{ color: getScoreColor(getAllScore(MarkData)) }}>
              {getLevel(getAllScore(MarkData))}
            </span>
          </span>
        </div>
        <div>
          <img src={PeriodScore_image} />
        </div>
        <div>
          <Info SelectedAsset={SelectedAsset} />
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
              id="MarkChart"
              style={{ width: "100%", height: "480px" }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresentMark;
