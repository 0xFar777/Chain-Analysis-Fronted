const sdk = require("api")("@chainbase/v1.0#5ryqsfllox7m1a");
const fs = require("fs");

const fetchDataAndAppendToFile = async(tokenName, contractAddr) => {
    try {
        // 设置初始日期为 2021 年 1 月 1 日
        let startDate = new Date("2021-01-01");

        // 进行 12 次调用，每次调用获取过去 90 天的记录
        let j = 0;
        for (let i = 0; i < 12; i++) {
            // 计算结束日期为 90 天后
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 90);

            // 调用 API 获取数据
            const response = await sdk.getTokenPriceHistory({
                chain_id: "1",
                contract_address: contractAddr,
                from_timestamp: Math.floor(startDate / 1000), // 将日期转换为秒级时间戳
                end_timestamp: Math.floor(endDate / 1000), // 将日期转换为秒级时间戳
                "x-api-key": "2bs9JQByoMMywTdy90mtISUqZGd",
            });
            await new Promise((resolve) => setTimeout(resolve, 1000));
            if (response && response.data && response.data.data) {
                const processedData = response.data.data.map((item) => ({
                    updated_at: Math.floor(new Date(item.updated_at).getTime() / 1000),
                    price: parseFloat(item.price).toFixed(8),
                }));

                processedData.sort((a, b) => a.updated_at - b.updated_at);
                console.log(processedData);
                let dataString = JSON.stringify(processedData, null, 2).slice(
                    1, -1
                );
                if (j === 0) {
                    dataString = "[" + dataString + ",";
                } else if (i === 11) {
                    dataString = dataString + "]";
                } else {
                    dataString = dataString + ",";
                }
                // 将数据追加到文件末尾
                fs.appendFile(
                    `./Ethereum/priceData/${tokenName}.json`,
                    dataString,
                    "utf8",
                    (err) => {
                        if (err) {
                            console.error("Error appending to file:", err);
                        } else {
                            console.log(`Data has been appended`);
                        }
                    }
                );
                j++;
            } else {
                console.log("Response does not contain valid data.");
            }
            // 更新 startDate 为 90 天后的日期，为下一次循环做准备
            startDate = endDate;
        }
    } catch (err) {
        console.error(err);
    }
};
// 读取命令行参数
const tokenName = process.argv[2];
const contractAddr = process.argv[3];

// 调用 fetchDataAndAppendToFile 函数
fetchDataAndAppendToFile(tokenName, contractAddr);

module.exports = {
    fetchDataAndAppendToFile
};