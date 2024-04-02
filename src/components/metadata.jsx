import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";

const ABI =
  '[\n  {\n    "inputs": [\n      {\n        "internalType": "uint256",\n        "name": "maxBatchSize_",\n        "type": "uint256"\n      },\n      {\n        "internalType": "uint256",\n        "name": "collectionSize_",\n        "type": "uint256"\n      },\n      {\n        "internalType": "uint256",\n        "name": "amountForAuctionAndDev_",\n        "type": "uint256"\n      },\n      {\n        "internalType": "uint256",\n        "name": "amountForDevs_",\n        "type": "uint256"\n      }\n    ],\n    "stateMutability": "nonpayable",\n    "type": "constructor"\n  },\n  {\n    "anonymous": false,\n    "inputs": [\n      {\n        "indexed": true,\n        "internalType": "address",\n        "name": "owner",\n        "type": "address"\n      },\n      {\n        "indexed": true,\n        "internalType": "address",\n        "name": "approved",\n        "type": "address"\n      },\n      {\n        "indexed": true,\n        "internalType": "uint256",\n        "name": "tokenId",\n        "type": "uint256"\n      }\n    ],\n    "name": "Approval",\n    "type": "event"\n  },\n  {\n    "anonymous": false,\n    "inputs": [\n      {\n        "indexed": true,\n        "internalType": "address",\n        "name": "owner",\n        "type": "address"\n      },\n      {\n        "indexed": true,\n        "internalType": "address",\n        "name": "operator",\n        "type": "address"\n      },\n      {\n        "indexed": false,\n        "internalType": "bool",\n        "name": "approved",\n        "type": "bool"\n      }\n    ],\n    "name": "ApprovalForAll",\n    "type": "event"\n  },\n  {\n    "anonymous": false,\n    "inputs": [\n      {\n        "indexed": true,\n        "internalType": "address",\n        "name": "previousOwner",\n        "type": "address"\n      },\n      {\n        "indexed": true,\n        "internalType": "address",\n        "name": "newOwner",\n        "type": "address"\n      }\n    ],\n    "name": "OwnershipTransferred",\n    "type": "event"\n  },\n  {\n    "anonymous": false,\n    "inputs": [\n      {\n        "indexed": true,\n        "internalType": "address",\n        "name": "from",\n        "type": "address"\n      },\n      {\n        "indexed": true,\n        "internalType": "address",\n        "name": "to",\n        "type": "address"\n      },\n      {\n        "indexed": true,\n        "internalType": "uint256",\n        "name": "tokenId",\n        "type": "uint256"\n      }\n    ],\n    "name": "Transfer",\n    "type": "event"\n  },\n  {\n    "inputs": [],\n    "name": "AUCTION_DROP_INTERVAL",\n    "outputs": [\n      {\n        "internalType": "uint256",\n        "name": "",\n        "type": "uint256"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [],\n    "name": "AUCTION_DROP_PER_STEP",\n    "outputs": [\n      {\n        "internalType": "uint256",\n        "name": "",\n        "type": "uint256"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [],\n    "name": "AUCTION_END_PRICE",\n    "outputs": [\n      {\n        "internalType": "uint256",\n        "name": "",\n        "type": "uint256"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [],\n    "name": "AUCTION_PRICE_CURVE_LENGTH",\n    "outputs": [\n      {\n        "internalType": "uint256",\n        "name": "",\n        "type": "uint256"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [],\n    "name": "AUCTION_START_PRICE",\n    "outputs": [\n      {\n        "internalType": "uint256",\n        "name": "",\n        "type": "uint256"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "address",\n        "name": "",\n        "type": "address"\n      }\n    ],\n    "name": "allowlist",\n    "outputs": [\n      {\n        "internalType": "uint256",\n        "name": "",\n        "type": "uint256"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [],\n    "name": "allowlistMint",\n    "outputs": [],\n    "stateMutability": "payable",\n    "type": "function"\n  },\n  {\n    "inputs": [],\n    "name": "amountForAuctionAndDev",\n    "outputs": [\n      {\n        "internalType": "uint256",\n        "name": "",\n        "type": "uint256"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [],\n    "name": "amountForDevs",\n    "outputs": [\n      {\n        "internalType": "uint256",\n        "name": "",\n        "type": "uint256"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "address",\n        "name": "to",\n        "type": "address"\n      },\n      {\n        "internalType": "uint256",\n        "name": "tokenId",\n        "type": "uint256"\n      }\n    ],\n    "name": "approve",\n    "outputs": [],\n    "stateMutability": "nonpayable",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "uint256",\n        "name": "quantity",\n        "type": "uint256"\n      }\n    ],\n    "name": "auctionMint",\n    "outputs": [],\n    "stateMutability": "payable",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "address",\n        "name": "owner",\n        "type": "address"\n      }\n    ],\n    "name": "balanceOf",\n    "outputs": [\n      {\n        "internalType": "uint256",\n        "name": "",\n        "type": "uint256"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "uint256",\n        "name": "quantity",\n        "type": "uint256"\n      }\n    ],\n    "name": "devMint",\n    "outputs": [],\n    "stateMutability": "nonpayable",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "uint64",\n        "name": "mintlistPriceWei",\n        "type": "uint64"\n      },\n      {\n        "internalType": "uint64",\n        "name": "publicPriceWei",\n        "type": "uint64"\n      },\n      {\n        "internalType": "uint32",\n        "name": "publicSaleStartTime",\n        "type": "uint32"\n      }\n    ],\n    "name": "endAuctionAndSetupNonAuctionSaleInfo",\n    "outputs": [],\n    "stateMutability": "nonpayable",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "uint256",\n        "name": "tokenId",\n        "type": "uint256"\n      }\n    ],\n    "name": "getApproved",\n    "outputs": [\n      {\n        "internalType": "address",\n        "name": "",\n        "type": "address"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "uint256",\n        "name": "_saleStartTime",\n        "type": "uint256"\n      }\n    ],\n    "name": "getAuctionPrice",\n    "outputs": [\n      {\n        "internalType": "uint256",\n        "name": "",\n        "type": "uint256"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "uint256",\n        "name": "tokenId",\n        "type": "uint256"\n      }\n    ],\n    "name": "getOwnershipData",\n    "outputs": [\n      {\n        "components": [\n          {\n            "internalType": "address",\n            "name": "addr",\n            "type": "address"\n          },\n          {\n            "internalType": "uint64",\n            "name": "startTimestamp",\n            "type": "uint64"\n          }\n        ],\n        "internalType": "struct ERC721A.TokenOwnership",\n        "name": "",\n        "type": "tuple"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "address",\n        "name": "owner",\n        "type": "address"\n      },\n      {\n        "internalType": "address",\n        "name": "operator",\n        "type": "address"\n      }\n    ],\n    "name": "isApprovedForAll",\n    "outputs": [\n      {\n        "internalType": "bool",\n        "name": "",\n        "type": "bool"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "uint256",\n        "name": "publicPriceWei",\n        "type": "uint256"\n      },\n      {\n        "internalType": "uint256",\n        "name": "publicSaleKey",\n        "type": "uint256"\n      },\n      {\n        "internalType": "uint256",\n        "name": "publicSaleStartTime",\n        "type": "uint256"\n      }\n    ],\n    "name": "isPublicSaleOn",\n    "outputs": [\n      {\n        "internalType": "bool",\n        "name": "",\n        "type": "bool"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [],\n    "name": "maxPerAddressDuringMint",\n    "outputs": [\n      {\n        "internalType": "uint256",\n        "name": "",\n        "type": "uint256"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [],\n    "name": "name",\n    "outputs": [\n      {\n        "internalType": "string",\n        "name": "",\n        "type": "string"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [],\n    "name": "nextOwnerToExplicitlySet",\n    "outputs": [\n      {\n        "internalType": "uint256",\n        "name": "",\n        "type": "uint256"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "address",\n        "name": "owner",\n        "type": "address"\n      }\n    ],\n    "name": "numberMinted",\n    "outputs": [\n      {\n        "internalType": "uint256",\n        "name": "",\n        "type": "uint256"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [],\n    "name": "owner",\n    "outputs": [\n      {\n        "internalType": "address",\n        "name": "",\n        "type": "address"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "uint256",\n        "name": "tokenId",\n        "type": "uint256"\n      }\n    ],\n    "name": "ownerOf",\n    "outputs": [\n      {\n        "internalType": "address",\n        "name": "",\n        "type": "address"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "uint256",\n        "name": "quantity",\n        "type": "uint256"\n      },\n      {\n        "internalType": "uint256",\n        "name": "callerPublicSaleKey",\n        "type": "uint256"\n      }\n    ],\n    "name": "publicSaleMint",\n    "outputs": [],\n    "stateMutability": "payable",\n    "type": "function"\n  },\n  {\n    "inputs": [],\n    "name": "renounceOwnership",\n    "outputs": [],\n    "stateMutability": "nonpayable",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "address",\n        "name": "from",\n        "type": "address"\n      },\n      {\n        "internalType": "address",\n        "name": "to",\n        "type": "address"\n      },\n      {\n        "internalType": "uint256",\n        "name": "tokenId",\n        "type": "uint256"\n      }\n    ],\n    "name": "safeTransferFrom",\n    "outputs": [],\n    "stateMutability": "nonpayable",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "address",\n        "name": "from",\n        "type": "address"\n      },\n      {\n        "internalType": "address",\n        "name": "to",\n        "type": "address"\n      },\n      {\n        "internalType": "uint256",\n        "name": "tokenId",\n        "type": "uint256"\n      },\n      {\n        "internalType": "bytes",\n        "name": "_data",\n        "type": "bytes"\n      }\n    ],\n    "name": "safeTransferFrom",\n    "outputs": [],\n    "stateMutability": "nonpayable",\n    "type": "function"\n  },\n  {\n    "inputs": [],\n    "name": "saleConfig",\n    "outputs": [\n      {\n        "internalType": "uint32",\n        "name": "auctionSaleStartTime",\n        "type": "uint32"\n      },\n      {\n        "internalType": "uint32",\n        "name": "publicSaleStartTime",\n        "type": "uint32"\n      },\n      {\n        "internalType": "uint64",\n        "name": "mintlistPrice",\n        "type": "uint64"\n      },\n      {\n        "internalType": "uint64",\n        "name": "publicPrice",\n        "type": "uint64"\n      },\n      {\n        "internalType": "uint32",\n        "name": "publicSaleKey",\n        "type": "uint32"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "address[]",\n        "name": "addresses",\n        "type": "address[]"\n      },\n      {\n        "internalType": "uint256[]",\n        "name": "numSlots",\n        "type": "uint256[]"\n      }\n    ],\n    "name": "seedAllowlist",\n    "outputs": [],\n    "stateMutability": "nonpayable",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "address",\n        "name": "operator",\n        "type": "address"\n      },\n      {\n        "internalType": "bool",\n        "name": "approved",\n        "type": "bool"\n      }\n    ],\n    "name": "setApprovalForAll",\n    "outputs": [],\n    "stateMutability": "nonpayable",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "uint32",\n        "name": "timestamp",\n        "type": "uint32"\n      }\n    ],\n    "name": "setAuctionSaleStartTime",\n    "outputs": [],\n    "stateMutability": "nonpayable",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "string",\n        "name": "baseURI",\n        "type": "string"\n      }\n    ],\n    "name": "setBaseURI",\n    "outputs": [],\n    "stateMutability": "nonpayable",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "uint256",\n        "name": "quantity",\n        "type": "uint256"\n      }\n    ],\n    "name": "setOwnersExplicit",\n    "outputs": [],\n    "stateMutability": "nonpayable",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "uint32",\n        "name": "key",\n        "type": "uint32"\n      }\n    ],\n    "name": "setPublicSaleKey",\n    "outputs": [],\n    "stateMutability": "nonpayable",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "bytes4",\n        "name": "interfaceId",\n        "type": "bytes4"\n      }\n    ],\n    "name": "supportsInterface",\n    "outputs": [\n      {\n        "internalType": "bool",\n        "name": "",\n        "type": "bool"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [],\n    "name": "symbol",\n    "outputs": [\n      {\n        "internalType": "string",\n        "name": "",\n        "type": "string"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "uint256",\n        "name": "index",\n        "type": "uint256"\n      }\n    ],\n    "name": "tokenByIndex",\n    "outputs": [\n      {\n        "internalType": "uint256",\n        "name": "",\n        "type": "uint256"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "address",\n        "name": "owner",\n        "type": "address"\n      },\n      {\n        "internalType": "uint256",\n        "name": "index",\n        "type": "uint256"\n      }\n    ],\n    "name": "tokenOfOwnerByIndex",\n    "outputs": [\n      {\n        "internalType": "uint256",\n        "name": "",\n        "type": "uint256"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "uint256",\n        "name": "tokenId",\n        "type": "uint256"\n      }\n    ],\n    "name": "tokenURI",\n    "outputs": [\n      {\n        "internalType": "string",\n        "name": "",\n        "type": "string"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [],\n    "name": "totalSupply",\n    "outputs": [\n      {\n        "internalType": "uint256",\n        "name": "",\n        "type": "uint256"\n      }\n    ],\n    "stateMutability": "view",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "address",\n        "name": "from",\n        "type": "address"\n      },\n      {\n        "internalType": "address",\n        "name": "to",\n        "type": "address"\n      },\n      {\n        "internalType": "uint256",\n        "name": "tokenId",\n        "type": "uint256"\n      }\n    ],\n    "name": "transferFrom",\n    "outputs": [],\n    "stateMutability": "nonpayable",\n    "type": "function"\n  },\n  {\n    "inputs": [\n      {\n        "internalType": "address",\n        "name": "newOwner",\n        "type": "address"\n      }\n    ],\n    "name": "transferOwnership",\n    "outputs": [],\n    "stateMutability": "nonpayable",\n    "type": "function"\n  },\n  {\n    "inputs": [],\n    "name": "withdrawMoney",\n    "outputs": [],\n    "stateMutability": "nonpayable",\n    "type": "function"\n  }\n]\n';

const ethProvider = new ethers.JsonRpcProvider(
  "https://eth-mainnet.g.alchemy.com/v2/m9Sn3ds6sHBOKB8MUtX5N57ygl4ggd2l"
);

const polygonProvider = new ethers.JsonRpcProvider(
  "https://polygon-mainnet.g.alchemy.com/v2/8TCsymEGtRVCwPKv6SfGPqscyUJvDHS2"
);

const TokenMeta = async (Assets, Metas) => {
  const fetchMeta = async (Assets, Metas) => {
    try {
      const allAssetMeta = [];
      for (let asset of Assets) {
        let found = false;
        if (Metas.length > 0) {
          for (const meta of Metas) {
            if (meta.name == asset.name) {
              allAssetMeta.push(meta);
              found = true;
              break;
            }
          }
        }
        if (!found) {
          const responseData = await fetchMetaData(
            asset.chain,
            asset.token,
            asset.name
          );
          allAssetMeta.push(responseData);
        }
      }
      return allAssetMeta;
    } catch (error) {
      console.error("Error fetching asset price data:", error);
      return [];
    }
  };

  const fetchMetaData = async (Chain, Token, Name) => {
    const maxRetries = 5; // 最大重试次数

    try {
      console.log(`Chain is ${Chain}, Token is ${Token}`);
      let data1;
      if (Chain != "999") {
        const response1 = await fetch(
          `https://api.chainbase.online/v1/token/metadata?chain_id=${Chain}&contract_address=${Token}`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              "x-api-key": "2c8EBsk3KmgCznMPIszr6gp8khd",
            },
          }
        );

        if (!response1.ok) {
          throw new Error("Failed to fetch data from endpoint 1");
        }

        data1 = await response1.json();
        console.log("======================================================");
        console.log(`response1 is ${data1.data}`);
        console.log("======================================================");
      }

      // let provider;
      // if (parseInt(Chain) == 1) {
      //   provider = ethProvider;
      // } else if (parseInt(Chain) == 137) {
      //   provider = polygonProvider;
      // } else {
      //   throw new Error("NO SUPPORT CHAIN");
      // }
      // const ContractConfig = new ethers.Contract(Token, ABI, provider);
      // const response2 = await ContractConfig.totalSupply();
      // const data2 = Number(response2);

      const response2 = await fetch(`http://127.0.0.1:5000/cap?asset=${Name}`, {
        method: "GET",
      });
      const data2 = await response2.json();
      console.log("======================================================");
      console.log(`response2 is ${data2}`);
      console.log("======================================================");

      let data3;
      if (Chain != "999") {
        const response3 = await fetch(
          `https://api.chainbase.online/v1/token/top-holders?chain_id=${Chain}&contract_address=${Token}&page=1&limit=50`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              "x-api-key": "2c8e7kowXMZ8UjlqIRUcfdZmNwz",
            },
          }
        );

        if (!response3.ok) {
          throw new Error("Failed to fetch data from endpoint 1");
        }

        data3 = await response3.json();
        console.log("======================================================");
        console.log(`response3 is ${data3.count}`);
        console.log("======================================================");
      }

      return {
        chain: Chain == "999" ? Name : chainToName(Chain),
        token: Chain == "999" ? Name : Token,
        name: Chain == "999" ? Name : data1.data.symbol,
        totalSupply: data2.supply,
        marketValue: data2.cap,
        logo:
          Chain == "999"
            ? 0
            : data1.data.logos[0].uri
            ? data1.data.logos[0].uri
            : "",
        holderCount: Chain == "999" ? 0 : data3.count,
        topHolders:
          Chain == "999"
            ? []
            : data3.data.map((item) => (item.amount * 100) / data2.supply),
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const chainToName = (Chain) => {
    if (Chain == "1") {
      return "Ethereum";
    } else if (Chain == "137") {
      return "Polygon";
    }
  };

  return fetchMeta(Assets, Metas);
};

export default TokenMeta;
