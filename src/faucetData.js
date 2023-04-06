export function faucetData(that) {
    return [
        {
            "network": "Goerli",
            "remark": that.$t('faucetData.ethereum')+that.$t('faucetData.testnet'),
            "chainID": "5",
            "currency": "GETH",
            "img": "tool_list1.png",
            "faucet": [
                {
                    "url": "https://goerlifaucet.com",
                    "remark": that.$t('faucetData.remarkGoerli[0]')
                },
                {
                    "url": "https://goerli-faucet.pk910.de",
                    "remark": that.$t('faucetData.remarkGoerli[1]')
                },
                {
                    "url": "https://faucet.paradigm.xyz",
                    "remark": that.$t('faucetData.remarkGoerli[2]')
                },
                {
                    "url": "https://grabteeth.xyz/",
                    "remark": that.$t('faucetData.remarkGoerli[3]')
                },
                {
                    "url": "https://unitap.app/",
                    "remark": ""
                },
                {
                    "url": "https://faucet.quicknode.com/drip",
                    "remark": ""
                },
                {
                    "url": "https://www.allthatnode.com/faucet/ethereum.dsrv",
                    "remark": ""
                }
            ]
        },
        {
            "network": "Sepolia",
            "chainID": "11155111",
            "remark": that.$t('faucetData.ethereum')+that.$t('faucetData.testnet'),
            "currency": "SETH",
            "img": "tool_list1.png",
            "faucet": [
                {
                    "url": "https://sepoliafaucet.com/",
                    "remark": that.$t('faucetData.remarkSepolia[0]')
                },
                {
                    "url": "https://sepolia-faucet.pk910.de/",
                    "remark": that.$t('faucetData.remarkSepolia[1]')
                },
                {
                    "url": "https://grabteeth.xyz/",
                    "remark": that.$t('faucetData.remarkSepolia[2]')
                },
                {
                    "url": "https://faucet.quicknode.com/drip",
                    "remark": ""
                },
                {
                    "url": "https://faucets.chain.link/",
                    "remark": ""
                }, {
                    "url": "https://www.infura.io/faucet?ref=chaintool.tech",
                    "remark": ""
                }
            ]
        },
        {
            "network": "Mumbai",
            "remark": "Polygon "+that.$t('faucetData.testnet'),
            "chainID": "80001",
            "currency": "tMATIC",
            "img": "PolygonLogo.png",
            "faucet": [
                {
                    "url": "https://mumbaifaucet.com/",
                    "remark":  that.$t('faucetData.remarkMumbai[0]')
                },
                {
                    "url": "https://faucet.polygon.technology",
                    "remark": ""
                }
            ]
        },
        {
            "network": "BNB Chain Testnet",
            "remark": "BSC "+that.$t('faucetData.testnet'),
            "chainID": "97",
            "currency": "tBNB",
            "img": "BscScanLogo.png",
            "faucet": [
                {
                    "url": "https://unitap.app/gas-tap",
                    "remark": ""
                },
                {
                    "url": "https://testnet.bnbchain.org/faucet-smart",
                    "remark": ""
                }
            ]
        },
        {
            "network": "Gnosis Chain",
            "remark": "Gnosis "+that.$t('faucetData.testnet'),
            "chainID": "300",
            "currency": "xDai",
            "img": "gnosisLogo.webp",
            "faucet": [
                {
                    "url": "https://stakely.io/faucet/xdai-chain",
                    "remark": ""
                }
            ]
        },
        {
            "network": "Avalanche Testnet",
            "remark": "Avalanche "+that.$t('faucetData.testnet'),
            "chainID": "43113",
            "currency": "AVAX",
            "img": "avalancheLogo.webp",
            "faucet": [
                {
                    "url": "https://faucet.avax-test.network",
                    "remark": ""
                }
            ]
        },
        {
            "network": "OKExChain Testnet",
            "remark": "OKExChain "+that.$t('faucetData.testnet'),
            "chainID": "65",
            "currency": "OKT",
            "img": "okexLogo.webp",
            "faucet": [
                {
                    "url": "https://gitter.im/kovan-testnet/faucet",
                    "remark": ""
                }
            ]
        },
        {
            "network": "Harmony Testnet",
            "remark": "Harmony "+that.$t('faucetData.testnet'),
            "chainID": "1666700000",
            "currency": "ONE",
            "img": "harmonyLogo.webp",
            "faucet": [
                {
                    "url": "https://faucet.pops.one",
                    "remark": that.$t('faucetData.remarkHarmony[0]')
                }
            ]
        },
        {
            "network": "Aurora Testnet",
            "remark": "Aurora "+that.$t('faucetData.testnet'),
            "chainID": "1313161555",
            "currency": "ETH",
            "img": "auroraLogo.webp",
            "faucet": [
                {
                    "url": "https://aurora.dev/faucet",
                    "remark": ""
                }
            ]
        },
        {
            "network": "Celo Alfajores Testnet",
            "remark": "Celo "+that.$t('faucetData.testnet'),
            "chainID": "44787",
            "currency": "CELO",
            "img": "celoLogo.webp",
            "faucet": [
                {
                    "url": "https://faucet.celo.org/",
                    "remark": that.$t('faucetData.remarkCelo[0]')
                }
            ]
        },
        {
            "network": "Cube Chain Testnet",
            "remark": "Cube "+that.$t('faucetData.testnet'),
            "chainID": "1819",
            "currency": "CUBET",
            "img": "cubeLogo.png",
            "faucet": [
                {
                    "url": "https://faucet.cube.network/",
                    "remark": ""
                },
            ] 
        }
    ]
} 