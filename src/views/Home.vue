<template>
    <div class="home">
        <Navigation></Navigation>
        <div class="container">
            <div class="topTips">
                <div>
                    <div><div>Chaintool - <span><a href="https://github.com/ChainToolDao/chaintool-frontend/issues" target="_blank">开源</a></span>工具箱</div>
                        让区块链开发更轻松
                    </div>
                    <div class="summary">开源才值得信赖，好用才提高效率，你所需的工具尽在于此。</div>
                    <button class="theFeedback">
                        <a href="https://github.com/ChainToolDao/chaintool-frontend/issues" class="theFeedback" target="_blank">问题反馈</a>
                    </button>
                </div>
                <img src="../assets/imgs/main.png">
            </div>
            <div class="title">工具列表</div>
            <div class="detail">免费效率工具，快上手试试吧</div>
            <div class="listTool">
                <div v-for="(item, index) in tool_list" :key="'tool_list' + index" @click="toRouter(item.router)">
                    <img :src='item.url'>
                    <div class="text">
                        <div class="textTitle">
                            <span>{{ item.title }}</span>
                            <img src="../assets/imgs/arrow-right.svg">
                        </div>
                        <div>{{ item.detail }}</div>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>

<script>
import Navigation from '../components/Navigation.vue'

export default {
    name: 'home',
    components: {
        Navigation,
    },
    metaInfo() {
        return {
            title: 'Chaintool - 区块链开发者的工具箱',

            meta: [
                {
                    name: 'keyword',
                    content: 'Chaintool,区块链工具,区块链开发'
                },
                {
                    name: 'description',
                    content: 'Chaintool 实用工具, 让区块链开发更轻松, 巧妙处理、提高效率，所需的工具尽在于此'
                }
            ]
        }
    },
    data() {
        return {
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
            ],
        }
    },
    methods: {
        toRouter(router) {
            this.$router.push(router)
        },
    },
}
</script>

<style scoped>
a {
    text-decoration-line: none;
}

.home {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    flex-direction: column;
}

.container {
    max-width: 1280px;
    /* min-height: calc(100vh - 130px); */
    padding-top: 20px;
    padding-bottom: 50px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 30px 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.container .topTips {
    display: flex;
    width: 100%;
    padding: 0 40px;
    margin-bottom: 20px;
    box-sizing: border-box;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 30px;
}

.container .topTips>div {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 100px;
    max-width: 50%;
}

.container .topTips>div div:first-child {
    color: #000;
    font-weight: 700;
    font-size: 44px;
}

.container .topTips>div div:last-child {
    font-size: 50px;
    font-weight: bold;
    color: #333333;
    line-height: 75px;
}

.container .topTips>div div:last-child span{
    font-size: 56px;
    font-family: SourceHanSansCN-Bold, SourceHanSansCN;
    font-weight: bold;
    color: #2E8FF0;
    line-height: 84px;
    background: linear-gradient(313deg, #5EF4CB 0%, #19AAE2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.container  .topTips div div{
    
}

.container .topTips>img {
    width: 512px;
    object-fit: contain;
}

.container .title {
    font-size: 30px;
    color: #000;
    font-weight: 700;
}

.container .detail {
    font-size: 18px;
    font-weight: 400;
    margin: 5px 0 20px;
}

.container .listTool {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    max-width: 1100px;
    width: 100%;
}

.container .listTool>div {
    display: flex;
    width: 356px;
    height: 118px;
    padding: 16px 24px;
    box-sizing: border-box;
    background-color: #FAFAFA;
    cursor: pointer;
}

.container .listTool>div:hover {
    background-color: #F5F5F5;
}

.container .listTool div img {
    width: 35px;
    height: 35px;
    object-fit: cover;
}

.container .listTool .text {
    margin-left: 16px;
    width: 100%;
}

.container .listTool .text img {
    width: 24px;
    height: 24px;
}

.container .listTool .text .textTitle {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.container .listTool .text div:last-child {
    margin-top: 16px;
}

@media (max-width: 1320px) {
    .container {
        max-width: calc(100vw - 40px);
    }
}

.footer {
    margin-top: 20px;
}

.el-button--primary {
    width: 260px;
}

.theFeedback {
    width: 127px;
    height: 37px;
    background: #141414;
    border-radius: 23px;
    border:none
}

.theFeedback a{
    width: 56px;
    height: 20px;
    font-size: 14px;
    color: #FFFFFF;
}

.summary{
    color:#0E1F59;
}
</style>