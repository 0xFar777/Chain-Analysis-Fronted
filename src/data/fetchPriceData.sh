# 定义日志文件路径
LOG_FILE="./logs/script_log.log"

# 重定向 stdout 和 stderr 到日志文件
echo "Script execution started at: $(date)" >> "$LOG_FILE"

# 循环遍历 token_Ethereum 数组
for ((i=0; i<45; i++)); do
    # 从 token.js 文件中提取 tokenName 和 contractAddr
    tokenName=$(grep -oP '(?<=tokenName: ")[^"]+' ./Ethereum/token.cjs | sed -n "$((i+1))p")
    contractAddr=$(grep -oP '(?<=contractAddr: ")[^"]+' ./Ethereum/token.cjs | sed -n "$((i+1))p")
    echo "Processing token: $tokenName, Contract Address: $contractAddr" >> "$LOG_FILE"
    node ./Ethereum/nodeHistoryData.cjs "$tokenName" "$contractAddr"
done

echo "Script execution finished at: $(date)" >> "$LOG_FILE"
read -n 1 -s -r -p "按任意键继续"

# node ./Ethereum/nodeHistoryData.cjs SHIB 0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE