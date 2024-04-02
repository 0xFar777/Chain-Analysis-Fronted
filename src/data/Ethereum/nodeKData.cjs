const fs = require("fs");

const fetchDataAndAppendToFile = async(tokenName) => {
    try {
        // 设置初始日期为 2021 年 1 月 1 日
        let startDate = new Date("2021-01-01");
        const currentDate = new Date();
        const diffTime = Math.abs(startDate - currentDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const totalLoops = Math.ceil(diffDays / 200);
        console.log(totalLoops);
        // 进行 totalLoops 次调用，每次调用获取过去 200 天的记录
        let j = 0;
        for (let i = 0; i < totalLoops; i++) {
            // 计算结束日期为 200 天后
            const endTimestamp = new Date(startDate);
            endTimestamp.setDate(endTimestamp.getDate() + 200);
            endTimestamp.setHours(23, 59, 59, 999);
            const toTimestamp = Math.floor(endTimestamp.getTime()) + 1;
            console.log(toTimestamp);

            const link = `https://api.bitget.com/api/v2/spot/market/history-candles?symbol=${tokenName}USDT&granularity=1day&endTime=${toTimestamp}&limit=200`;

            console.log(link);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                controller.abort(); // 超时后中止请求
            }, 10000); // 设置超时时间为10秒

            // 调用 API 获取数据
            const response = await fetch(link, {
                method: "GET",
                headers: {
                    accept: "application/json",
                },
                signal: controller.signal,
            });
            await new Promise((resolve) => setTimeout(resolve, 500));
            if (!response.ok) {
                throw new Error("Failed to fetch data from endpoint 1");
            }

            const data = await response.json();
            console.log(data.data);

            // 更新 startDate 为 200 天后的日期，为下一次循环做准备
            startDate = endDate;
        }
    } catch (err) {
        console.error(err);
    }
};

fetchDataAndAppendToFile("AAVE");

// // 读取命令行参数
// const tokenName = process.argv[2];
// const contractAddr = process.argv[3];

// // 调用 fetchDataAndAppendToFile 函数
// fetchDataAndAppendToFile(tokenName, contractAddr);

// module.exports = {
//     fetchDataAndAppendToFile,
// };