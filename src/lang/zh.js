export default {
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
                router: '/unitConvert',
                url: require('../assets/imgs/tool_list1.png'),
            },
            {
                title: '批量查询',
                detail: '批量查询钱包余额',
                router: '/bulkQuery',
                url: require('../assets/imgs/tool_list2.png'),
            },
            // {
            //     title: '批量转账',
            //     detail: '批量转账',
            //     router: '/bulkTransfer',
            //     url: require('../assets/imgs/tool_list3.png'),
            // },
            {
                title: '交易分析',
                detail: '解析 EVM 交易内部详情',
                router: '/traceview',
                url: require('../assets/imgs/tool_list4.png'),
            },
            {
                title: 'ABI 可视化调用',
                detail: '根据 ABI 自动生成可调用函数',
                router: '/abi',
                url: require('../assets/imgs/tool_list5.png'),
            },
            {
                title: '地址转换与ENS查询',
                detail: '地址查询转换与ENS查询',
                router: '/address',
                url: require('../assets/imgs/tool_list6.png'),
            },
            {
                title: '生成 EVM 钱包',
                detail: '批量生成 EVM 钱包',
                router: '/generateWallet',
                url: require('../assets/imgs/tool_list8.png'),
            },
            {
                title: '签名选择器查询',
                detail: '根据函数签名查询 4 字节函数选择器',
                router: '/querySelector',
                url: require('../assets/imgs/tool_list7.png'),
            },
            {
                title: '事件签名查询主题(TopicID)',
                detail: '根据事件签名查询主题TopicID及反向查询',
                router: '/topicID',
                url: require('../assets/imgs/tool_list9.png'),
            },
            {
                title: 'Hash 工具',
                detail: '常用 Hash 工具，如keccak-256、base64 等计算',
                router: '/hashTool',
                url: require('../assets/imgs/tool_list10.png'),
            },
            {
                title: '交易输入数据编解码',
                detail: '编码及解码交易输入数据（Input Calldata）',
                router: '/calldata',
                url: require('../assets/imgs/tool_list11.png'),
            },
            {
                title: '测试币水龙头',
                detail: '测试网水龙头测试币获取',
                router: '/faucet',
                url: require('../assets/imgs/tool_list11.png'),
            },
        ],
    }
}