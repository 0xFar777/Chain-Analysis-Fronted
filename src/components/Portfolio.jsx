import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

const Portfolio = ({ Assets }) => {
  const [MonteCarlo, setMonteCarlo] = useState([]);
  const [scipyData, setScipyData] = useState([]);
  const PortfolioChartRef = useRef(null);

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
        fetchMarket();
      }
    }
  }, [Assets]);

  useEffect(() => {
    if (
      Object.keys(MonteCarlo).length !== 0 &&
      Object.keys(scipyData).length !== 0
    ) {
      // 只有在数据加载完毕后才执行渲染图表的操作
      PortfolioChart();
    }
  }, [MonteCarlo, scipyData]);

  const fetchMarket = () => {
    fetch(
      `http://127.0.0.1:5000/market?assets=${Assets.map((item) => item.name)}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("ssssssssssssssssssssssssssssssssssssssssss");
        console.log(data);
        console.log("ssssssssssssssssssssssssssssssssssssssssss");
        setScipyData([]);
        setMonteCarlo([]);
        setScipyData({
          returns: data.expected_returns,
          variances: data.min_variances,
          weight: data.optimal_weights,
          minPort: data.minPort,
        });
        setMonteCarlo({
          returns: data.returns,
          variances: data.variances,
          weight: data.weight,
        });
      })
      .catch((error) => console.error("Error fetching CSV file:", error));
  };

  const PortfolioChart = () => {
    if (PortfolioChartRef.current) {
      PortfolioChartRef.current.dispose();
    }
    const xdif = (
      Math.max(...MonteCarlo.variances) - Math.min(...MonteCarlo.variances)
    ).toFixed(3);
    const ydif = (
      Math.max(...MonteCarlo.returns) - Math.min(...MonteCarlo.returns)
    ).toFixed(3);
    const xmin = Math.max(
      (Math.min(...MonteCarlo.variances) - xdif * 0.2).toFixed(3),
      0
    );
    const xmax = (Math.max(...MonteCarlo.variances) + xdif * 0.2).toFixed(3);
    const ymin = Math.max(
      (Math.min(...MonteCarlo.returns) - ydif * 0.2).toFixed(3),
      0
    );
    const ymax = (Math.max(...MonteCarlo.returns) + ydif * 0.2).toFixed(3);
    const newChartDom = document.getElementById("PortfolioChart");
    const newCorrChart = echarts.init(newChartDom);
    console.log(MonteCarlo.variances.map((v, i) => [v, MonteCarlo.returns[i]]));
    console.log(scipyData.minPort[0]);
    console.log(scipyData.minPort[1]);
    console.log(scipyData.weight[2][0]);
    const option = {
      xAxis: {
        type: "value",
        name: "Risk",
        interval: (xmax - xmin) / 3,
        min: xmin,
        max: xmax,
        axisLabel: {
          formatter: function (value) {
            return value.toFixed(3); // 设置横坐标刻度保留3位小数
          },
        },
      },
      yAxis: {
        type: "value",
        name: "R",
        interval: (ymax - ymin) / 3,
        min: ymin,
        max: ymax,
        axisLabel: {
          formatter: function (value) {
            return value.toFixed(3); // 设置横坐标刻度保留3位小数
          },
        },
      },

      series: [
        {
          name: "Monte Carlo",
          type: "scatter",
          data: MonteCarlo.variances.map((v, i) => [v, MonteCarlo.returns[i]]),
          color: "blue",
          symbolSize: 1,
        },
        {
          name: "Efficient Frontier",
          type: "line",
          data: scipyData.variances.map((v, i) => ({
            value: [v, scipyData.returns[i]],
            weight: scipyData.weight[i], // 添加权重信息
          })),
          lineStyle: {
            color: "red",
            width: 5,
          },
        },
        {
          name: "Minimum Variance",
          type: "scatter",
          data: [
            {
              value: [scipyData.minPort[1], scipyData.minPort[0]],
              weight: scipyData.minPort[2], // 添加权重信息
            },
          ],
          symbolSize: 25,
          itemStyle: {
            color: "white", // 设置星星颜色
          },
          symbol:
            "path://M 200 200 l-40 100 100 -80 -120 0 100 80 -40 -120 -40 120z",
          z: 888,
        },
      ],
      grid: {
        left: "12.5%",
        right: "5%",
        top: "9%",
        bottom: "10%",
        containLabel: false,
      },
      tooltip: {
        formatter: function (params) {
          if (
            params.seriesName === "Efficient Frontier" ||
            params.seriesName === "Minimum Variance"
          ) {
            const RPercentage = (params.value[1] * 100).toFixed(2);

            console.log(params.value);
            const assetInfo = Assets.map((asset, index) => {
              const assetWeight = (params.data.weight[index] * 100).toFixed(2);
              return `${asset.name} : ${assetWeight}% <br/>`;
            }).join("");
            return `E(R) : ${RPercentage}% <br/> Var : ${params.value[0].toFixed(
              4
            )}<br/> ${assetInfo}`;
          } else {
            return ""; // 不显示 tooltip
          }
        },
      },
    };

    newCorrChart.setOption(option);
    PortfolioChartRef.current = newCorrChart;
  };

  return (
    <>
      <div className="basic-chart">
        <div
          className="chart-container middle-container"
          style={{ width: "100%", margin: "2.5% 1.5% 0 1.75%" }}
        >
          <div>
            <h1 className="chart-title">Portfolio</h1>
          </div>
          <div
            id="PortfolioChart"
            style={{ width: "100%", height: "345px" }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default Portfolio;
   