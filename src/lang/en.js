export default {
    overall:{
        usingHelp:"使用帮助"
    },
    navigation:{
        connectWallet:"连接钱包"
    },
    home: {
        title: ["开源", "工具箱", "让区块链开发更轻松"],
        describe: "开源才值得信赖，好用才提高效率，你所需的工具尽在于此。",
        feedback: "问题反馈",
        toolList: "工具列表",
        listDescribe: "免费效率工具，快上手试试吧",
        tool_list: [
            {
                title: '单位换算',
                detail: 'ETH 单位换算',
            },
            {
                title: '批量查询',
                detail: '批量查询钱包余额',
            },
            {
                title: '交易分析',
                detail: '解析 EVM 交易内部详情',
            },
            {
                title: 'ABI 可视化调用',
                detail: '根据 ABI 自动生成可调用函数',
            },
            {
                title: '地址转换与ENS查询',
                detail: '地址查询转换与ENS查询',
            },
            {
                title: '生成 EVM 钱包',
                detail: '批量生成 EVM 钱包',
            },
            {
                title: '签名选择器查询',
                detail: '根据函数签名查询 4 字节函数选择器',
            },
            {
                title: '事件签名查询主题(TopicID)',
                detail: '根据事件签名查询主题TopicID及反向查询',
            },
            {
                title: 'Hash 工具',
                detail: '常用 Hash 工具，如keccak-256、base64 等计算',
            },
            {
                title: '交易输入数据编解码',
                detail: '编码及解码交易输入数据（Input Calldata）',
            },
            {
                title: '测试币水龙头',
                detail: '测试网水龙头测试币获取',
            },
        ],
    },
    uintConvert:{
        title:"以太 ETH 单位转换器",
        describe:"以太币的最小单位是Wei，1个ETH等于10的18次方Wei。在支付Gas费时大家习惯使用Gwei作为展示单位，日常使用的单位是ETH、Gwei 和 Wei；",
        illustrate:["以太坊 Ethereum 和以太币 Ether 的区别：","以太坊 Ethereum 是一个允许任何人在其上创建和使用分布式应用的开放的区块链平台。","以太币 Ether 是以太坊 Ethereum 中通用的货币，它主要用于支付转账及执行智能合约所消耗的汽油(Gas)，在交易中以太币被缩写为ETH。"],
    }
}