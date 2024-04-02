import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";

const AssetPrice = ({ AssetPriceData, TimeRange }) => {
  const [AssetPriceChart, setAssetPriceChart] = useState(null);
  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00"];

  useEffect(() => {
    if (TimeRange.start != null && TimeRange.end != null) {
      if (AssetPriceData.length > 0) {
        console.log("===========");
        console.log(AssetPriceData);
        console.log("===========");
        AssetChart();
      }
    }
  }, [AssetPriceData, TimeRange]);

  const AssetChart = () => {
    if (AssetPriceChart) {
      AssetPriceChart.dispose();
    }

    const newChartDom = document.getElementById("AssetPriceDataChart");
    let newAssetPriceChart;
    if (newChartDom) {
      newAssetPriceChart = echarts.init(newChartDom);
    }

    // 筛选数据
    let tempPriceData = {
      name: AssetPriceData[0].name,
      data: AssetPriceData[0].data,
    };
    console.log(`returnreturnreturn${tempPriceData.data[0].price}`);
    console.log(`start is ${TimeRange.start}`);

    if (TimeRange.start != null && TimeRange.end != null) {
      tempPriceData = {
        name: tempPriceData.name,
        data: tempPriceData.data.filter(
          (item) =>
            parseInt(item.updatedAt) >= TimeRange.start &&
            parseInt(item.updatedAt) <= TimeRange.end
        ),
      };
    } else {
      throw new Error("NO SET TIMERANGE");
    }

    // 创建时间序列
    const timeSet = new Set();

    tempPriceData.data.forEach((item) => {
      if (item.updatedAt) {
        timeSet.add(item.updatedAt * 1000);
      }
    });
    const timeArray = [...timeSet];
    timeArray.sort((a, b) => a - b);

    const assetSeriesData = [];

    timeArray.forEach((timestamp) => {
      const foundData = tempPriceData.data.find(
        (item) => item.updatedAt * 1000 === timestamp
      );
      if (foundData && foundData.price) {
        assetSeriesData.push(Number(foundData.price).toFixed(4));
      } else {
        assetSeriesData.push(null);
      }
    });
    const seriesData = {
      name: `${tempPriceData.name}`, // 每种资产的名称
      type: "line",
      smooth: true,
      data: assetSeriesData,
      lineStyle: {
        width: 1.5,
        color: colors[0],
      },
      itemStyle: {
        color: colors[0],
      },
    };

    const option = {
      xAxis: {
        type: "category",
        data: timeArray.map((timestamp) =>
          new Date(timestamp).toLocaleDateString()
        ),
        axisLine: {
          lineStyle: {
            fontSize: 14,
          },
        },
        axisLabel: {
          fontSize: 14,
          color: "#fff",
        },
        name: "Date",
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
        },
        name: `${tempPriceData.name}/USDT`,
        nameTextStyle: {
          fontSize: 18,
        },
      },
      grid: {
        left: "5%",
        right: "5%",
        bottom: "15%",
        containLabel: true,
      },
      series: seriesData,
      toolbox: {
        orient: "vertical",
        itemSize: "30",
        feature: {
          dataZoom: {
            yAxisIndex: "none",
          },
          saveAsImage: {},
          magicType: {
            type: ["bar", "line"],
          },
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
        show: true,
      },
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 100,
          filterMode: "filter",
        },
        {
          start: 0,
          end: 100,
          handleIcon: "M0,0 v9.7h5 v-18.7h-5 Z",
          handleSize: "80%",
          handleStyle: {
            color: "#fff",
            shadowBlur: 3,
            shadowColor: "rgba(0, 0, 0, 0.6)",
            shadowOffsetX: 2,
            shadowOffsetY: 2,
          },
          textStyle: {
            color: "#fff",
          },
        },
      ],
    };
    if (newChartDom) {
      newAssetPriceChart.setOption(option);
      setAssetPriceChart(newAssetPriceChart);
    }
  };

  return (
    <>
      <div
        id="AssetPriceDataChart"
        style={{ width: "100%", height: "560px" }}
      ></div>
    </>
  );
};

export default AssetPrice;
