export default {
    overall: {
        //使用帮助
        usingHelp: "Help",
        //复制成功
        copySauccessfully: "Copyed",
        // 复制失败
        copyFailed: "Copy Failed"
    },
    navigation: {
        // 连接钱包
        connectWallet: "Connect Wallet"
    },
    home: {
        // ["开源", "工具箱", "让区块链开发更轻松"]
        title: ["OpenSource ", "Toolbox", "Make Blockchain Develop More Easier"],
        // 开源才值得信赖，好用才提高效率，你所需的工具尽在于此。
        describe: "Open source is trustworthy, good to use to improve efficiency. The tools you need are here.",
        // 问题反馈
        feedback: "Feedback",
        // 工具列表
        toolList: "Tools",
        // 免费效率工具，快上手试试吧 
        listDescribe: "Free & Efficiency, try it out",
        tool_list: [
            {
                // 单位换算
                title: 'Unit Converter',
                // ETH 单位换算
                detail: 'ETH Unit Converter',
            },
            {
                // 批量查询
                title: 'Balance Querier',
                // 批量查询钱包余额
                detail: 'Batch query wallet balance',
            },
            {
                // 交易分析
                title: 'Tx Trace Viewer',
                // 解析 EVM 交易内部详情
                detail: 'Parse internal details of EVM transactions',
            },
            {
                // ABI 可视化调用 
                title: 'ABI Reader & Sender',
                // 根据 ABI 自动生成可调用函数
                detail: 'Friendly generate callable functions for ABI',
            },
            {
                // 地址转换与ENS查询
                title: 'Address <-> ENS',
                // 地址查询转换与ENS查询
                detail: 'Address lookup and ENS lookup',
            },
            {
                // 生成 EVM 钱包
                title: 'Wallet Generator',
                // 批量生成 EVM 钱包
                detail: 'Trustworthy & Batch EVM Wallet Generator',
            },
            {
                // 签名选择器查询
                title: 'Selector Querier',
                // 根据函数签名查询 4 字节函数选择器
                detail: 'Function selector <=> Function signature',
            },
            {
                // 事件签名查询主题(TopicID)
                title: 'TopicID Querier',
                // 根据事件签名查询主题TopicID及反向查询
                detail: 'Event TopicID <=> Event signature',
            },
            {
                // Hash 工具
                title: 'Hash Tools',
                // 常用 Hash 工具，如keccak-256、base64 等计算
                detail: 'Commonly used Hash Tools: keccak-256, base64 and so on...',
            },
            {
                // 交易输入数据编解码
                title: 'Input Calldata Decoder & Encoder',
                // 编码及解码交易输入数据（Input Calldata）
                detail: 'Encoding and decoding Tx Calldata',
            },
            {
                // 测试币水龙头
                title: 'Testnet Faucets',
                // 测试网水龙头测试币获取
                detail: 'Testnet Faucet All in one',
            },
        ],
    },
    uintConvert: {
        title: "Unit Converter",
        describe: "The smallest unit of Ether is Wei in EVM, 1 Ether == 10^18 Wei, gwei usual as the unit when paying gas fee.",
        illustrate: ["The difference between ethereum and ether:", "Ethereum is an open blockchain platform that allows anyone to deploy or interact with smart contracts on it", "Ether is the native coin in Ethereum, ether used to pay for the gas fee"],
    },
    bulkQuery: {
        title: "Balance Querier",
        enterAddress: "Token Address",
        enterAddressPrompt: "Input your wallet address",
        enterWalletAddress: "Wallet",
        enterWalletAddressPrompt: "One address per line",
        inquireResult: "Result",
        list: ["Wallet", "Token", "Balance", "No Data"],
        checkBalance: "Get Balance",
        exportExcel: "Download Excel",
        exportExcelPrompt: "No balance data",
        checkBalancePrompt: ["No wallet address", "Token address error, please review"],
    },
    traceView: {
        title: "Tx Trace Viewer",
        transactionHash: "Tx Hash",
        inputTransactionHash: "Input transaction hash",
        analyze: "Analyze",
        options: "options",
        inputAddressMap: "Input address alias",
        inputFunctionMap: "Input function alias",
        example: "A example",
        AddressMap: "Address alias",
        FunctionMap: "Function alias",
        CallTraces: "Traces",
        prompt: ["input tx hash", "retry input tx hash and "]
    },
    abi: {
        title: "ABI Reader & Sender",
        addContract: "添加合约",
        share: "分享",
        sharePrompt: "链接分享给好友，将自动加载合约",
        ABI: "查看ABI",
        ABIPrompt: "点击可查看ABI,还可以复制ABI",
        Etherscan: "查看Etherscan",
        EtherscanPrompt: "点击可跳转到对应区块链浏览器",
        edit: "编辑",
        editPrompt: "可修改合约的名称、网络、地址、ABI",
        delect: "删除",
        delectPrompt: "点击可删除合约",
        contractName: "合约名称",
        blockchainAddress: "区块链地址",
        contractAddress: "合约地址",
        callFunctions: "调用函数：",
        inputValue: "请输入Value",
        pleaseChoose: "请选择",
        clearOutput: "清空输出",
        run: "运行",
        transactionDetails: "交易详情：",
        returnContent: "返回内容：",
        contract: "合约",
        commonABIs: "常见ABI",
        blockchainNetwork: "区块链网络",
        selectNetwork: "请选择要连接的网络",
        chooseCommonABI: "选择常见ABI",
        uploadABIFile: "上传ABI文件",
        etherscanGet: "Etherscan获取",
        cancel: "取 消",
        sure: "确 定",
        checkABI: "查看ABI",
        jsonABI: "JSON ABI",
        readableABI: "可读的ABI",
        inputPrompt: "请输入内容",
        copy: "复 制",
        quit: "退 出",
        validateName: "请输入合约名称",
        sameName: "已有相同名称合约存在",
        validateAddress: "请输入正确的合约地址",
        checkAbi: "请输入 ABI",
        checkNetwork: "请选择区块链网络",
        autoAddError: '自动添加合约失败',
        doesNotSupportSharing: "当前合约暂不支持分享",
        copyShareSuccess: "复制分享链接成功",
        examineAddressAndNetwork: "请输入项目地址和输入网络后重试",
        getABIeroor: "ABI获取失败",
        useCurrentNetwork: "使用当前连接网络",
        checkAbiError: "ABI有误!添加失败,请检查后重试",
        notSelectedContractPrompt: "当前暂未选择合约",
        contractNotRecorded: "该合约Etherscan暂未被记录",
        deniedAccess: "User denied account access",
        notInstalledMetaMaskPrompt: "Need install MetaMask",
        abiError: "ABI有误",
        switchNetworkPrompt: "当前钱包连接的链与本合约连接的链不同。将为你切换到对应网络",
        currentNetworkError: "当前网络错误",
        connectionRequestError: "连接请求错误，请尝试手动连接。连接后刷新页面重试。",
    },
    address: {
        title: "Address <-> ENS",
        address: "wallet address",
        convert: "Lookup",
        inquire: "Lookup",
        inputENS: "ens domain",
        loadPrompt: "loading",
        errorAddressPrompt: "invalid wallet address, please retype",
        errorENSPrompt: "No corresponding results were found."
    },
    generateWallet: {
        title: "Wallet Generator",
        tips: ["Tips:  only run in your browser, totally", "Open Source", ". No one can get your mnemonic or private key, feel free to use."],
        randomBatch: "By Random",
        customize: "By Pri-key or Mnemonic",
        mnemonicLength: "How many mnemonic words",
        quantity: "Address numbers",
        generateImmediately: "Create",
        regenerate: "Re-create",
        exportexcel: "Download",
        walletsNumber: "Address numbers",
        subtitle: "Create Wallet by Private key or mnemonic",
        createNow: "Create",
        enterPrompt: "Private key or mnemonic",
        copy: "Copy",
        address: "Address",
        privateKey: "Pri-key",
        mnemonic: 'Mnemonic',
        nullErrorPrompt: "Invalid input",
        IllegalErrorPrompt: "Invalid address numbers",
        beyondErrorPrompt: "Address number too big, must be smaller than 100",
        inputErrorPrompt: "Create failed"
    },
    querySelector: {
        title: "Selector Querier",
        inputFunctionName: 'Get selector by function signature',
        // 输入函数签名
        inputFunctionNamePrompt: "enter the function signature",
        inquire: "query",
        inputByteFunctionSelector: "Get function signature by selector",
        functionInputError: "Input error",
        querying: "loading",
        noRecord: "no record",
    },
    topicID: {
        title: "TopicID Querier",
        EventSignature: 'Get topicId by event signature',
        // 输入事件签名
        inputEventSignature: "Input Event Signature",
        inquire: "query",
        TopicID: "Get event signature by topicId",
        InputTopicID: "Input topicId",
        signatureInputError: "Such as: event Transfer(address indexed from, address indexed to, uint256 amount)",
        querying: "loading",
        topicIDInputError: "no record"
    },
    hashTool: {
        title: "Hash Tools",
        confirm: "Confirm",
        coding: "Encoding",
        decoding: "Decoding",
        errorHexadecimal: "Invalid hex data",
        decodingError: "Decoding Error",
        noInput: "No input data"
    },
    calldata: {
        title: "Input Calldata Decoder & Encoder",
        decoding: "Decoding",
        coding: "Encoding",
        inputFunction: "input function",
        inputFunctionPrompt: "function signaturs",
        parameter: "Params",
        inputParameterPrompt: "A param per line, Array like this:[0x2222,0x4444]",
        inputError: "Input Error",
        inputCalldata: "Calldata:",
        selectFunction: "Function",
        autoChoose: "Auto",
        manualInput: "Manual",
        decodingResult: "Result",
        parameter: "Param",
        parameterType: "Type",
        value: "Value",
        queryFailed: "An error has occurred",
    },
    faucet: {
        title: "Testnet Faucets",
        prompt: ["Request testnet coins and tokens for test you smart contract.", "ChainTool Faucets collet commonly used faucet websites for developers to enjoy.", "If you have a faucet website that we don't list, feel free to submit ", "PR", " or ", "ISSUE", ", Your support is our motivation."],
        currency: "Currency",
        url: "Website",
        remark: "Comment",
        operate: "Operate",
        receive: "Go",
        copyUrl: "Copy",
        copyURLSuccessfully: "URL Copied",
    }
}