import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";

const BasicChart = ({ Assets }) => {
  const [MVChart, setMVChart] = useState(null);
  const [HChart, setHChart] = useState(null);
  const [HInfoChart, setHInfoChart] = useState(null);
  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00"];

  useEffect(() => {
    if (Assets && Assets.length > 0) {
      for (let i = 0; i < Assets.length; i++) {
        const asset = Assets[i];
        if (asset.token) {
          MarketValueChart();
          HolderChart();
          HolderInfoChart();
          break;
        }
      }
    }
  }, [Assets]);

  const MarketValueChart = () => {
    if (MVChart) {
      MVChart.dispose();
    }

    const formatMV = (mv) => {
      if (mv >= 1000000000) {
        return (mv / 1000000000).toFixed(4) + "B";
      } else if (mv >= 1000000) {
        return (mv / 1000000).toFixed(4) + "M";
      } else if (mv >= 1000) {
        return (mv / 1000).toFixed(4) + "K";
      } else {
        return mv.toFixed(4);
      }
    };

    console.log(`Assets is ${Assets[0].name}`);

    const newChartDom = document.getElementById("mvChart");
    const newMVChart = echarts.init(newChartDom);

    const seriesData = [
      {
        name: "Market Value",
        type: "bar",
        data: Assets.map((asset) => asset.marketValue),
        itemStyle: {
          color: function (params) {
            return colors[params.dataIndex];
          },
        },
        barWidth: "30%",
        label: {
          show: true,
          position: "top",
          formatter: function (params) {
            return formatMV(params.value);
          },
        },
      },
    ];

    const option = {
      xAxis: {
        type: "category",
        data: Assets.map((Asset) => Asset.name),
        axisLine: {
          lineStyle: {
            fontSize: 14,
          },
        },
        axisLabel: {
          fontSize: 14,
          color: "#fff",
        },
        name: "Token",
        nameTextStyle: {
          fontSize: 18,
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            fontSize: 14,
          },
        },
        axisLabel: {
          fontSize: 14,
          color: "#fff",
          formatter: function (value) {
            // 将刻度值格式化为科学计数法
            return value.toExponential(2);
          },
        },
        name: `USDT`,
        nameTextStyle: {
          fontSize: 18,
        },
      },
      series: seriesData,
      grid: {
        left: "5%",
        right: "15%",
        top: "20%",
        bottom: "6%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis", // 设置触发类型为 axis，表示鼠标悬停在轴上时显示 Tooltip
        axisPointer: {
          type: "shadow", // 设置指示器为阴影，即跟随柱子的阴影
        },
        formatter: function (params) {
          const dataIndex = params[0].dataIndex; // 获取鼠标所在柱子的索引
          const asset = Assets[dataIndex]; // 获取对应的资产信息
          const marketValue = formatMV(params[0].data); // 获取柱子的市值

          // 自定义 Tooltip 的显示内容
          return `
              <div style="text-align: center; max-width: 80%; margin: 0 auto; font-size: 1em;">
                  <img src="${asset.logo}" style="width: 66%; height: auto; margin: 8% auto 0 auto;">
                  <br>
                  <div style="margin-top: 0%;">
                      <span style="font-size: 18px;">Name : ${asset.name}</span>
                  </div>
                  <div style="margin-top: 4%;">
                      <span style="font-size: 18px;">Chain : ${asset.chain}</span>
                  </div>
                  <div style="margin-top: 4%;">
                      <span style="font-size: 18px;">Cap : ${marketValue}</span>
                  </div>
                  <br>
              </div>
            `;
        },
      },
    };
    newMVChart.setOption(option);
    setMVChart(newMVChart);
  };

  const HolderChart = () => {
    if (HChart) {
      HChart.dispose();
    }

    const newChartDom = document.getElementById("holderChart");
    const newHolderChart = echarts.init(newChartDom);
    // Assets={metaData.filter(asset => asset.chain != asset.name)}
    const seriesData = [
      {
        name: "Holder Count",
        type: "bar",
        data: Assets.filter((asset) => asset.chain != asset.name).map(
          (asset) => asset.holderCount
        ),
        itemStyle: {
          color: function (params) {
            return colors[params.dataIndex];
          },
        },
        barWidth: "30%",
        label: {
          show: true,
          position: "top",
        },
      },
    ];

    const option = {
      xAxis: {
        type: "category",
        data: Assets.filter((asset) => asset.chain != asset.name).map((Asset) => Asset.name),
        axisLine: {
          lineStyle: {
            fontSize: 14,
          },
        },
        axisLabel: {
          fontSize: 14,
          color: "#fff",
        },
        name: "Token",
        nameTextStyle: {
          fontSize: 18,
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            fontSize: 14,
          },
        },
        axisLabel: {
          fontSize: 14,
          color: "#fff",
          formatter: function (value) {
            // 将刻度值格式化为科学计数法
            return value.toExponential(2);
          },
        },
        name: `Count`,
        nameTextStyle: {
          fontSize: 18,
        },
      },
      series: seriesData,
      grid: {
        left: "10%",
        right: "15%",
        top: "20%",
        bottom: "6%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis", // 设置触发类型为 axis，表示鼠标悬停在轴上时显示 Tooltip
        axisPointer: {
          type: "shadow", // 设置指示器为阴影，即跟随柱子的阴影
        },
        formatter: function (params) {
          const dataIndex = params[0].dataIndex; // 获取鼠标所在柱子的索引
          const asset = Assets.filter((asset) => asset.chain != asset.name)[
            dataIndex
          ]; // 获取对应的资产信息

          // 自定义 Tooltip 的显示内容
          return `
              <div style="text-align: center; max-width: 80%; margin: 0 auto; font-size: 1em;">
                  <img src="${asset.logo}" style="width: 66%; height: auto; margin: 8% auto 0 auto;">
                  <br>
                  <div style="margin-top: 0%;">
                      <span style="font-size: 18px;">Name : ${asset.name}</span>
                  </div>
                  <div style="margin-top: 4%;">
                      <span style="font-size: 18px;">Chain : ${asset.chain}</span>
                  </div>
                  <div style="margin-top: 4%;">
                      <span style="font-size: 18px;">Holder : ${asset.holderCount}</span>
                  </div>
                  <br>
              </div>
            `;
        },
      },
    };
    newHolderChart.setOption(option);
    setHChart(newHolderChart);
  };

  const HolderInfoChart = () => {
    if (HInfoChart) {
      HInfoChart.dispose();
    }

    const newChartDom = document.getElementById("holderInfoChart");
    const newHolderInfoChart = echarts.init(newChartDom);

    const top3Data = [];
    const top10Data = [];
    const top20Data = [];
    const top50Data = [];
    const othersData = [];

    Assets.filter((asset) => asset.chain != asset.name).forEach((asset) => {
      const top3 = asset.topHolders
        .slice(0, 3)
        .reduce((acc, val) => acc + val, 0);
      const top10 = asset.topHolders
        .slice(3, 10)
        .reduce((acc, val) => acc + val, 0);
      const top20 = asset.topHolders
        .slice(10, 20)
        .reduce((acc, val) => acc + val, 0);
      const top50 = asset.topHolders
        .slice(20, 50)
        .reduce((acc, val) => acc + val, 0);
      const others = 100 - (top3 + top10 + top20 + top50);

      top3Data.push(top3);
      top10Data.push(top10);
      top20Data.push(top20);
      top50Data.push(top50);
      othersData.push(others);
    });

    const option = {
      xAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            fontSize: 14,
          },
        },
        axisLabel: {
          fontSize: 14,
          color: "#fff",
        },
        name: "percent",
        nameTextStyle: {
          fontSize: 18,
        },
      },
      yAxis: {
        type: "category",
        data: Assets.filter((asset) => asset.chain != asset.name).map((asset) => asset.name),
        axisLine: {
          lineStyle: {
            fontSize: 14,
          },
        },
        axisLabel: {
          fontSize: 14,
          color: "#fff",
        },
        name: `Asset`,
        nameTextStyle: {
          fontSize: 18,
        },
      },
      legend: {
        data: ["top3", "top10", "top20", "top50", "others"],
        right: "center",
        label: {
          show: true,
        },
      },
      series: [
        {
          name: "top3",
          type: "bar",
          stack: "Ad",
          color: colors[0],
          barWidth: 24,
          data: top3Data,
          label: {
            show: true,
            formatter: function (params) {
              return params.value.toFixed(2) + "%";
            },
          },
        },
        {
          name: "top10",
          type: "bar",
          stack: "Ad",
          color: colors[1],
          barWidth: 24,
          data: top10Data,
          label: {
            show: true,
            formatter: function (params) {
              return params.value.toFixed(2) + "%";
            },
          },
        },
        {
          name: "top20",
          type: "bar",
          stack: "Ad",
          color: "#7FFFD4",
          barWidth: 24,
          data: top20Data,
          label: {
            show: true,
            formatter: function (params) {
              return params.value.toFixed(2) + "%";
            },
          },
        },
        {
          name: "top50",
          type: "bar",
          stack: "Ad",
          color: colors[3],
          barWidth: 24,
          data: top50Data,
          label: {
            show: true,
            formatter: function (params) {
              return params.value.toFixed(2) + "%";
            },
          },
        },
        {
          name: "others",
          type: "bar",
          stack: "Ad",
          color: "grey",
          barWidth: 24,
          data: othersData,
          label: {
            show: true,
            formatter: function (params) {
              return params.value.toFixed(2) + "%";
            },
          },
        },
      ],
      grid: {
        left: "5%",
        right: "15%",
        top: "20%",
        bottom: "6%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params) {
          const assetIndex = params[0].dataIndex;
          let tooltipContent = `<strong>${
            Assets.filter((asset) => asset.chain != asset.name)[assetIndex].name
          }</strong><br>`;
          tooltipContent += `01 - 03 : ${(
            (top3Data[assetIndex] / 100) *
            100
          ).toFixed(3)}%<br>`;
          tooltipContent += `04 - 10 : ${(
            (top10Data[assetIndex] / 100) *
            100
          ).toFixed(3)}%<br>`;
          tooltipContent += `11 - 20 : ${(
            (top20Data[assetIndex] / 100) *
            100
          ).toFixed(3)}%<br>`;
          tooltipContent += `21 - 50 : ${(
            (top50Data[assetIndex] / 100) *
            100
          ).toFixed(3)}%<br>`;
          tooltipContent += `Others : ${(
            (othersData[assetIndex] / 100) *
            100
          ).toFixed(3)}%<br>`;
          return tooltipContent;
        },
      },
    };
    newHolderInfoChart.setOption(option);
    setHInfoChart(newHolderInfoChart);
  };

  return (
    <>
      <div className="basic-chart">
        <div
          className="chart-container middle-container"
          style={{ marginRight: "0.4%", width: "75%" }}
        >
          <div>
            <h1 className="chart-title">Market Value</h1>
          </div>
          <div id="mvChart" style={{ width: "100%", height: "200px" }}></div>
        </div>
        <div
          className="chart-container middle-container"
          style={{ marginLeft: "0.2%", marginRight: "0.2%", width: "150%" }}
        >
          <div>
            <h1 className="chart-title">Holder Distribution (Only Token)</h1>
          </div>
          <div
            id="holderInfoChart"
            style={{ width: "100%", height: "200px" }}
          ></div>
        </div>
        <div
          className="chart-container middle-container"
          style={{ marginLeft: "0.4%", width: "75%" }}
        >
          <div>
            <h1 className="chart-title">Holder Count (Only Token)</h1>
          </div>
          <div
            id="holderChart"
            style={{ width: "100%", height: "200px" }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default BasicChart;
