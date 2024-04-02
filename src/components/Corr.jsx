import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { corr } from "mathjs";

const Corr = ({ PriceData, SelectedTime }) => {
  const [corrData, setCorrData] = useState([]);
  const corrChartRef = useRef(null);

  useEffect(() => {
    if (SelectedTime.start == null || SelectedTime.end == null) {
      return;
    }
    if (PriceData && PriceData.length >= 2) {
      for (let i = 0; i < PriceData.length; i++) {
        const assetPrice = PriceData[i];
        if (assetPrice.name) {
          const data = countCorr();
          setCorrData(data);
          CORRChart(data);
          break;
        }
      }
    }
  }, [PriceData, SelectedTime]);

  const countCorr = () => {
    const filterPriceData = filterData();
    console.log(filterPriceData);
    if (filterPriceData == null) {
      return [];
    }
    const results = [];
    for (let i = 0; i < filterPriceData.length; i++) {
      for (let j = i + 1; j < filterPriceData.length; j++) {
        const correlation = corr(
          [...filterPriceData[i].data.map((item) => item.price)],
          [...filterPriceData[j].data.map((item) => item.price)]
        );
        results.push({
          name1: filterPriceData[i].name,
          name2: filterPriceData[j].name,
          corr: correlation.toFixed(4),
        });
        console.log(
          `Correlation coefficient between array ${i + 1} and array ${j + 1}:`,
          correlation
        );
      }
    }
    return results;
  };

  // const filterData = () => {
  //   const start = SelectedTime.start;
  //   const end = SelectedTime.end;
  //   if (start != null && end != null) {
  //     console.log(`aaaaaaaaaaaa start is ${start}, end is ${end}`);
  //     return PriceData.map((assetPriceData) => ({
  //       name: assetPriceData.name,
  //       data: assetPriceData.data.filter(
  //         (item) =>
  //           parseInt(item.updatedAt) >= parseInt(start) &&
  //           parseInt(item.updatedAt) <= parseInt(end)
  //       ),
  //     }));
  //   } else {
  //     return null;
  //   }
  // };

  const filterData = () => {
    const start = SelectedTime.start;
    const end = SelectedTime.end;
    if (start != null && end != null) {
      console.log(`Start is ${start}, End is ${end}`);
      // 找到最短的数据集长度
      const shortestLength = Math.min(
        ...PriceData.map((assetPriceData) => assetPriceData.data.length)
      );
      // 对所有数据集进行相同的筛选
      const filteredData = PriceData.map((assetPriceData) => ({
        name: assetPriceData.name,
        data: assetPriceData.data
          .filter(
            (item) =>
              parseInt(item.updatedAt) >= parseInt(start) &&
              parseInt(item.updatedAt) <= parseInt(end)
          )
          .slice(0, shortestLength), // 仅保留最短长度的数据
      }));
      return filteredData;
    } else {
      return null;
    }
  };

  const CORRChart = (data) => {
    if (corrChartRef.current) {
      corrChartRef.current.dispose();
    }

    const newChartDom = document.getElementById("CorrInfoChart");
    const newCorrChart = echarts.init(newChartDom);

    if (data.length === 0) {
      return;
    }

    const uniqueName1 = data
      .map((item) => item.name1)
      .filter((value, index, self) => self.indexOf(value) === index);
    const uniqueName2 = data
      .map((item) => item.name2)
      .filter((value, index, self) => self.indexOf(value) === index);
    const xAxisData = [...new Set([...uniqueName1, ...uniqueName2])];
    const yAxisData = xAxisData;
    const corrValues = data.map((item) => [
      xAxisData.indexOf(item.name1),
      yAxisData.indexOf(item.name2),
      item.corr,
    ]);
    const mirroredCorrValues = corrValues.map((item) => [
      item[1],
      item[0],
      item[2],
    ]);
    const combinedCorrValues = [...corrValues, ...mirroredCorrValues];

    const option = {
      tooltip: {
        position: "top",
        formatter: function (params) {
          const xAxisName = xAxisData[params.value[0]];
          const yAxisName = yAxisData[params.value[1]];
          const corrValue = params.value[2];
          return `${xAxisName} - ${yAxisName} : ${corrValue}`;
        },
      },
      animation: false,
      grid: {
        height: "68%",
        top: "6%",
        left: "15%",
        right: "7%",
      },
      xAxis: {
        type: "category",
        data: xAxisData,
        splitArea: {
          show: true,
        },
      },
      yAxis: {
        type: "category",
        data: yAxisData,
        splitArea: {
          show: true,
        },
      },
      visualMap: {
        min: -1,
        max: 1,
        calculable: true,
        orient: "horizontal",
        left: "center",
        inRange: {
          color: ["#d94e5d", "#eac736", "#50a3ba"],
        },
      },
      series: [
        {
          name: "Correlation Coefficient",
          type: "heatmap",
          data: combinedCorrValues,
          label: {
            show: true,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    newCorrChart.setOption(option);
    corrChartRef.current = newCorrChart;
  };

  return (
    <>
      <div className="basic-chart">
        <div
          className="chart-container middle-container"
          style={{ width: "100%", margin: "0 1.5% 0 1.75%" }}
        >
          <div>
            <h1 className="chart-title">Correlation</h1>
          </div>
          <div
            id="CorrInfoChart"
            style={{ width: "100%", height: "190px" }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default Corr;
