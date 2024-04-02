import React, { useState, useEffect } from "react";
import * as echarts from "echarts";
import { SectionWrapper } from "../hoc";
import { token_Ethereum } from "../constants/tokenlist/ethereum";
import { token_BlockChain } from "../constants/tokenlist/blockchain";
import { DateSelectionComponent } from ".";
import TokenMeta from "./metadata";
import { BasicChart } from ".";
import { AssetPrice } from ".";
import { KChart } from ".";
import { Corr } from ".";
import { Portfolio } from ".";
import { HistoryMark } from ".";
import { PresentMark } from ".";
import { MultiMark } from ".";

import "../styles";

const About = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState([0, 100]);
  const [tempChain, setTempChain] = useState("");
  const [selectedAssets, setSelectedAssets] = useState([
    { chain: "", token: "", name: "" },
  ]);
  const [metaData, setMetaData] = useState([
    {
      chain: "",
      token: "",
      name: "",
      totalSupply: "",
      marketValue: "",
      logo: "",
      holderCount: "",
      topHolders: "",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customInputValue, setCustomInputValue] = useState("");
  const [priceData, setPriceData] = useState([]);
  const [showAsset, setShowAsset] = useState("BTC");
  const [load, setLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMeta, setIsLoadMeta] = useState(false);
  const [myChart, setMyChart] = useState(null);
  const [selectTime, setSelectTime] = useState({ start: null, end: null });
  const [selectedTime, setSelectedTime] = useState({ start: null, end: null });
  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00"];
  const [maxStartTimeStamp, setMaxStartTimeStamp] = useState(1609459200);

  useEffect(() => {
    const newChartDom = document.getElementById("priceChart");
    if (newChartDom && !myChart) {
      const newMyChart = echarts.init(newChartDom);
      // 这里可以配置你的图表
      setMyChart(newMyChart);
    }
  }, [myChart]);

  // useEffect(() => {
  //   setSelectedTime({ start: null, end: null });
  //   if (selectedAssets[selectedAssets.length - 1].token != "") {
  //     fetchAssetPriceData();
  //     getTokenMeta(selectedAssets, metaData);
  //     // handleAssetSelection(selectedAssets[selectedAssets.length - 1].name);
  //   }
  // }, [selectedAssets]);

  useEffect(() => {
    setSelectedTime({ start: null, end: null });
    // 检查所有 asset 的 name 属性是否都不为空字符串
    const allNamesNotEmpty = selectedAssets.every((asset) => asset.name != "");

    if (allNamesNotEmpty) {
      fetchAssetPriceData();
      getTokenMeta(selectedAssets, metaData);
      // handleAssetSelection(selectedAssets[selectedAssets.length - 1].name);
    }
  }, [selectedAssets]);

  const getTokenMeta = async (Assets, Metas) => {
    const allMetaData = await TokenMeta(Assets, Metas);
    setMetaData(allMetaData);
    console.log(`all Meta is ${allMetaData}`);
    allMetaData.forEach((data, index) => {
      console.log(`MetaData[${index}] Name: ${data.name}`);
      console.log(`MetaData[${index}] Total Supply: ${data.totalSupply}`);
      console.log(`MetaData[${index}] Market Value: ${data.marketValue}`);
      console.log(`MetaData[${index}] Logo: ${data.logo}`);
      console.log(`MetaData[${index}] Holder Count: ${data.holderCount}`);
      console.log(`MetaData[${index}] Holder Count: ${data.topHolders}`);
    });
    setIsLoadMeta(false);
  };

  useEffect(() => {
    // 检查所有资产的价格数据数组是否都有数据
    const hasPriceData = priceData.every(
      (assetPriceData) => assetPriceData.data.length > 0
    );
    if (hasPriceData) {
      // setShowAsset()
      renderChart({ start: 0, end: 1e18 });
    }
  }, [priceData]); // 当 priceData 改变时重新渲染图表

  // 2bnp5ivApjfguVA2OooRuRBivxq

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log(showAsset);
    }, 10000);

    // 在组件卸载时清除定时器
    return () => clearInterval(intervalId);
  }, [showAsset]);

  const fetchAssetPriceData = async () => {
    try {
      setIsLoadMeta(true);
      setIsLoading(true); // 开始加载数据
      const allAssetPriceData = [];
      let maxStartTime = 0;
      let assetTime = 0;
      for (const asset of selectedAssets) {
        let foundEqual = false;
        for (const haveAsset of priceData) {
          if (haveAsset.name == asset.name) {
            allAssetPriceData.push(haveAsset);
            const nowMaxStartTime = haveAsset.data[0].updatedAt;
            if (nowMaxStartTime > maxStartTime) {
              maxStartTime = nowMaxStartTime;
            }
            if (showAsset == asset.name) {
              assetTime = nowMaxStartTime;
            }
            foundEqual = true;
            break;
          }
        }
        if (!foundEqual) {
          const assetPriceData = [];
          // 在此处获取每种资产的价格数据
          const responseData = await fetchSyncPriceData(
            asset.chain,
            asset.token,
            asset.name
          );
          console.log(`opoppopoo${responseData[0].updatedAt}`);
          assetPriceData.push(...responseData);
          const mergeData = {
            name: asset.name,
            data: [...assetPriceData],
          };
          const nowMaxStartTime = mergeData.data[0].updatedAt;
          console.log(`nowMaxStartTime is ${nowMaxStartTime}`);
          if (nowMaxStartTime > maxStartTime) {
            maxStartTime = nowMaxStartTime;
          }
          console.log(`priceData is ${priceData}`);
          allAssetPriceData.push(mergeData);
          assetTime = nowMaxStartTime;
          console.log(`assssssstname is ${asset.name}`);
          handleAssetSelection(asset.name);
        }
      }
      console.log(`assetTime isisisis${assetTime}`);
      setMaxStartTimeStamp(maxStartTime);
      setPriceData(allAssetPriceData);
      setSelectTime({
        start: assetTime,
        end: parseInt(new Date().getTime() / 1000),
      });
      console.log(`maxSsss:${new Date(maxStartTime * 1000)} ${new Date()}`);
    } catch (error) {
      console.error("Error fetching asset price data:", error);
      return [];
    }
  };

  const fetchSyncPriceData = async (chain, token, name) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/getdata?name=${name}`
      );
      const data = await response.json();
      const handleData = data.map((item) => ({
        price: item.close,
        quote_volume: item.quote_volume,
        updatedAt: Number(item.date) / 1000,
      }));
      console.log(`dsdsdsdsds${handleData[0].price}`);
      return handleData;
    } catch (error) {
      console.error("Error fetching CSV file:", error);
      throw error;
    }
  };

  const renderChart = ({ start, end }) => {
    if (myChart) {
      myChart.dispose();
    }

    console.log(`start is ${start}, end is ${end}`);
    setTimeout(() => {
      const newChartDom = document.getElementById("priceChart");
      console.log(newChartDom);
      let newMyChart;
      if (newChartDom) {
        newMyChart = echarts.init(newChartDom);
      }

      // 筛选数据
      const filteredPriceData = priceData.map((assetPriceData) => ({
        name: assetPriceData.name,
        data: assetPriceData.data.filter(
          (item) => item.updatedAt >= maxStartTimeStamp
        ),
      }));
      let tempPriceData = filteredPriceData;
      console.log(`returnreturnreturn${tempPriceData === priceData}`);
      console.log(`returnreturnreturn${tempPriceData}`);

      if (start != null && end != null) {
        console.log(`start is ${start}, end is ${end}`);
        tempPriceData = tempPriceData.map((assetPriceData) => ({
          name: assetPriceData.name,
          data: assetPriceData.data.filter(
            (item) =>
              parseInt(item.updatedAt) >= parseInt(start) &&
              parseInt(item.updatedAt) <= parseInt(end)
          ),
        }));
      }

      console.log(tempPriceData.length);

      // 创建统一的时间序列
      const timeSet = new Set();

      tempPriceData.forEach((assetPriceData) => {
        assetPriceData.data.forEach((item) => {
          if (item.updatedAt) {
            timeSet.add(item.updatedAt * 1000);
          }
        });
      });
      const timeArray = [...timeSet];
      timeArray.sort((a, b) => a - b);

      // 构建数据序列
      const seriesData = [];
      tempPriceData.forEach((assetPriceData, index) => {
        const assetSeriesData = [];
        // 找到价格的最小值和最大值
        let minPrice = Infinity;
        let maxPrice = -Infinity;
        assetPriceData.data.forEach((item) => {
          if (item.price) {
            minPrice = Math.min(minPrice, item.price);
            maxPrice = Math.max(maxPrice, item.price);
          }
        });
        timeArray.forEach((timestamp) => {
          const foundData = assetPriceData.data.find(
            (item) => item.updatedAt * 1000 === timestamp
          );
          if (foundData && foundData.price) {
            // 归一化处理价格数据
            const normalizedPrice =
              (foundData.price - minPrice) / (maxPrice - minPrice);
            assetSeriesData.push(normalizedPrice.toFixed(4));
          } else {
            assetSeriesData.push(null);
          }
        });
        seriesData.push({
          name: `${selectedAssets[index].name}`, // 每种资产的名称
          type: "line",
          smooth: true,
          data: assetSeriesData,
          lineStyle: {
            width: 0.5,
            color: colors[index],
          },
          itemStyle: {
            color: colors[index],
          },
        });
      });

      console.log(`series data is ${seriesData.length}`);

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
          name: `Asset/USDT`,
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
        series: seriesData, // 设置每种资产的数据
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
        newMyChart.setOption(option);
        setMyChart(newMyChart);
        newMyChart.on("dataZoom", function (params) {
          const range = newMyChart
            .getModel()
            .getComponent("dataZoom", params.batch[0].dataZoomIndex)
            .getPercentRange();
          setSelectedTimeRange(range);
        });
      }
      if (isLoading) {
        setIsLoading(false);
      }
      setLoad(false);
      console.log(selectedAssets);
    }, 500);
  };

  const handleAddAsset = () => {
    // 将新资产添加到已选择资产列表中
    setTempChain("");
    setSelectTime({ start: null, end: null });
    setSelectedAssets([...selectedAssets, { chain: "", token: "", name: "" }]);
  };

  const handleAssetChainChange = (event, index) => {
    setTempChain(event.target.value);
    const updatedAssets = selectedAssets.map((asset, idx) => {
      if (idx === index) {
        return {
          ...asset,
          chain: event.target.value,
          token: "",
          name: "",
        };
      }
      return asset;
    });
    console.log("rrrrrrrrrrrrrrrrr");
    console.log(updatedAssets);
    console.log("rrrrrrrrrrrrrrrrr");
    setSelectedAssets(updatedAssets);
  };

  const handleAssetTokenChange = (event, index) => {
    const str = event.target.value;
    if (str == "custom") {
      setIsModalOpen(true);
      setCustomInputValue("");
    }
    const selectedChain = tempChain;
    const selectedToken = str.split(":")[0];
    const selectedName = str.split(":")[1];

    const updatedAssets = selectedAssets.map((asset, idx) => {
      if (idx === index) {
        setShowAsset(selectedName);
        return {
          ...asset,
          chain: asset.chain == "" ? tempChain : asset.chain,
          token: selectedToken,
          name: selectedName,
        };
      }
      return asset;
    });
    console.log("pppppppppppppppp");
    console.log(updatedAssets);
    console.log("pppppppppppppppp");
    setSelectedAssets(updatedAssets);
  };

  const handleRemoveAsset = (indexToRemove) => {
    const updatedAssets = selectedAssets.filter(
      (_, index) => index !== indexToRemove
    );
    // setSelectTime({ start: null, end: null });
    setSelectedAssets(updatedAssets);
    setShowAsset(updatedAssets[updatedAssets.length - 1].name);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAssetSelection = (asset) => {
    setSelectedTime({ start: null, end: null });
    setShowAsset(asset);
    if (asset == "Compare") {
      renderChart({ start: maxStartTimeStamp, end: selectTime.end });
      setSelectTime({ start: maxStartTimeStamp, end: selectTime.end });
    }
    if (asset != "compare") {
      console.log(priceData);
      if (priceData.length > 0) {
        const filterAssetData = priceData.filter((item) => item.name === asset);
        if (filterAssetData.length > 0) {
          console.log(`------------------${filterAssetData}`);
          const startTime = filterAssetData[0].data[0].updatedAt;
          console.log(`start timememe is ${startTime}`);
          const endTime =
            filterAssetData[0].data[filterAssetData[0].data.length - 1]
              .updatedAt;
          console.log(`end timememe is ${endTime}`);
          setSelectTime({ start: startTime, end: endTime });
        }
      }
    }
  };

  const handleSubmit = (index) => {
    console.log("Submitted custom token address:", customInputValue);
    const updatedAssets = [...selectedAssets];
    console.log(updatedAssets);
    updatedAssets[index].token = customInputValue;
    setSelectedAssets(updatedAssets);
    setIsModalOpen(false);
  };

  const handleTime = (DateTimestamp) => {
    // 处理开始时间和结束时间的时间戳
    console.log("Start Date Timestamp:", DateTimestamp.startTimeStamp);
    console.log("End Date Timestamp:", DateTimestamp.endTimeStamp);
    renderChart({
      start: DateTimestamp.startTimeStamp,
      end: DateTimestamp.endTimeStamp,
    });
    setSelectedTime({
      start: DateTimestamp.startTimeStamp,
      end: DateTimestamp.endTimeStamp,
    });
  };

  return (
    <div className="page-container">
      <div className="assets-container">
        <div className="item-middle">
          <div>
            {selectedAssets.map((asset, index) => (
              <div key={index}>
                <label
                  style={{
                    color: colors[index],
                    display: "inline-block",
                    width: "12%",
                    borderBottom: `0.2cm solid ${colors[index]}`,
                  }}
                ></label>
                <label>
                  <span className="select-title">Select Chain</span>
                  <select
                    className="select-chain"
                    value={asset.chain}
                    onChange={(event) => handleAssetChainChange(event, index)}
                  >
                    <option value="">Select Chain</option>
                    <option value="999">Block Chain</option>
                    <option value="1">Ethereum</option>
                    <option value="56">Binance</option>
                    <option value="137">Polygon</option>
                  </select>
                </label>
                <label>
                  <span className="select-title">Select Token</span>
                  <select
                    className="select-token"
                    value={
                      asset.name != undefined
                        ? `${asset.token}:${asset.name}`
                        : `custom token`
                    }
                    onChange={(event) => handleAssetTokenChange(event, index)}
                    disabled={!tempChain} // Disable until chain is selected
                  >
                    {!asset.token && <option value="">Select Token</option>}
                    {/* <option value="custom">
                      {"Custom Token" + " " + `[${asset.token}]`}
                    </option> */}
                    {asset.chain == "999" &&
                      token_BlockChain.map((token, index) => (
                        <option
                          key={index}
                          value={`${token.contractAddr}:${token.tokenName}`}
                        >
                          {token.tokenName}
                        </option>
                      ))}
                    {asset.chain == "1" &&
                      token_Ethereum.map((token, index) => (
                        <option
                          key={index}
                          value={`${token.contractAddr}:${token.tokenName}`}
                        >
                          {token.tokenName}[{token.contractAddr}]
                        </option>
                      ))}
                  </select>
                </label>

                <button
                  className={`remove-button ${
                    index === 0 ||
                    selectedAssets[selectedAssets.length - 1].token === "" ||
                    isLoading ||
                    isLoadMeta
                      ? "button-disabled"
                      : ""
                  }`}
                  onClick={() => handleRemoveAsset(index)}
                  disabled={
                    index === 0 ||
                    selectedAssets[selectedAssets.length - 1].token === "" ||
                    isLoading ||
                    isLoadMeta
                  }
                >
                  Remove Asset
                </button>

                {isModalOpen && index === selectedAssets.length - 1 && (
                  <div className="modal-overlay-A select-title">
                    <div className="modal-A">
                      <span className="modal-close-A" onClick={closeModal}>
                        x
                      </span>
                      <span>Input Address</span>
                      <br />
                      <input
                        type="text"
                        value={customInputValue}
                        onChange={(e) => setCustomInputValue(e.target.value)}
                      />
                      <button onClick={() => handleSubmit(index)}>
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div class="add-button-container">
            <button
              className={`add-button ${
                selectedAssets.length >= 4 ||
                selectedAssets[selectedAssets.length - 1].token === "" ||
                isLoading ||
                isLoadMeta
                  ? "button-disabled"
                  : ""
              }`}
              onClick={handleAddAsset}
              disabled={
                selectedAssets.length >= 4 ||
                selectedAssets[selectedAssets.length - 1].token === "" ||
                isLoading ||
                isLoadMeta
              }
            >
              <h2>Add Asset</h2>
            </button>
          </div>
          {selectTime.start !== null &&
            selectTime.end !== null &&
            !isLoading && (
              <div>
                <DateSelectionComponent
                  timeRange={selectTime}
                  onSubmit={handleTime}
                />
              </div>
            )}
        </div>
        <div style={{ display: "inline-flex", width: "100%" }}>
          <div className="info-container">
            {showAsset != "Compare" && (
              <HistoryMark SelectedAsset={showAsset} />
            )}
            {showAsset == "Compare" && (
              <div>
                <div>
                  <Corr
                    PriceData={priceData}
                    SelectedTime={
                      selectedTime.start ? selectedTime : selectTime
                    }
                  />
                </div>
                <div>
                  <Portfolio Assets={selectedAssets} />
                </div>
              </div>
            )}
          </div>
          <div className="chart-container middle-container">
            <div>
              <div>
                <h1 className="chart-title">
                  History Price
                  {"  "}
                  {!isLoading && selectTime.start
                    ? selectedTime.start
                      ? `${new Date(
                          parseInt(selectedTime.start) * 1000
                        ).toLocaleDateString()}`
                      : `${new Date(
                          parseInt(selectTime.start) * 1000
                        ).toLocaleDateString()}`
                    : ""}
                  {!isLoading && selectTime.start ? "  to  " : null}
                  {!isLoading && selectTime.end
                    ? selectedTime.end
                      ? `${new Date(
                          parseInt(selectedTime.end) * 1000
                        ).toLocaleDateString()}`
                      : `${new Date(
                          parseInt(selectTime.end) * 1000
                        ).toLocaleDateString()}`
                    : ""}
                </h1>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {metaData[0].token !== "" &&
                    metaData.map((asset) => (
                      <button
                        className={`asset-button ${
                          isLoading ||
                          selectedAssets[selectedAssets.length - 1].token ===
                            "" ||
                          metaData[metaData.length - 1].token === "" ||
                          showAsset === asset.name
                            ? "button-disabled"
                            : ""
                        }`}
                        key={asset.name}
                        onClick={() => handleAssetSelection(asset.name)}
                        disabled={
                          isLoading ||
                          metaData[metaData.length - 1].token === "" ||
                          selectedAssets[selectedAssets.length - 1].token ===
                            "" ||
                          showAsset === asset.name
                        }
                      >
                        {asset.name}
                      </button>
                    ))}
                  {metaData.length >= 2 && (
                    <button
                      className={`asset-button ${
                        isLoading ||
                        selectedAssets[selectedAssets.length - 1].token ===
                          "" ||
                        metaData[metaData.length - 1].token === "" ||
                        showAsset === "Compare"
                          ? "button-disabled"
                          : ""
                      }`}
                      onClick={() => handleAssetSelection("Compare")}
                      style={{ marginLeft: "10%" }}
                      disabled={
                        isLoading ||
                        selectedAssets[selectedAssets.length - 1].token ===
                          "" ||
                        metaData[metaData.length - 1].token === "" ||
                        showAsset === "Compare"
                      }
                    >
                      Compare
                    </button>
                  )}
                </div>
              </div>
              {showAsset != "" && showAsset != "Compare" && (
                <AssetPrice
                  AssetPriceData={priceData.filter(
                    (item) => item.name === showAsset
                  )}
                  TimeRange={selectedTime.start ? selectedTime : selectTime}
                />
              )}
              {(showAsset == "" || showAsset == "Compare") && (
                <div
                  id="priceChart"
                  style={{ width: "100%", height: "560px" }}
                ></div>
              )}
              {/* <KChart/> */}
            </div>
          </div>
          <div className="info-container">
            {showAsset != "Compare" && (
              <div>
                <div>
                  <PresentMark SelectedAsset={showAsset} />
                </div>
              </div>
            )}
            {showAsset == "Compare" && (
              <div>
                <div>
                  <MultiMark Assets={selectedAssets} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* {showAsset == "Compare" && (
        <div>
          <Corr
            PriceData={priceData}
            SelectedTime={selectedTime.start ? selectedTime : selectTime}
          />
        </div>
      )} */}
      <div>
        <BasicChart Assets={metaData} />
      </div>
      <div style={{ backgroundColor: "", paddingBottom: "2%" }}>
        <KChart Asset={showAsset} />
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");
