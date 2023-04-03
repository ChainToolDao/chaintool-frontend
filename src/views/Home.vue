<template>
	<div class="home">
		<Navigation></Navigation>
		<div class="container">
			<div class="topTips">
				<div>
					<div>
						<div>Chaintool - <span><a href="https://github.com/ChainToolDao"
									target="_blank">{{$t("home.title[0]")}}</a></span>{{$t("home.title[1]")}}</div>
						{{$t("home.title[2]")}}
					</div>
					<div class="summary"> {{$t("home.describe")}}</div>
					<button class="theFeedback">
						<a href="https://github.com/ChainToolDao/chaintool-frontend/issues" class="theFeedback"
							target="_blank">{{$t("home.feedback")}}</a>
					</button>
				</div>
				<img src="../assets/imgs/main.png">
			</div>
			<div class="title">{{$t("home.toolList")}}</div>
			<div class="detail">{{$t("home.listDescribe")}}</div>
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
					content: 'Chaintool,区块链工具,区块链开发',
				},
				{
					name: 'description',
					content:
						'Chaintool 实用工具, 让区块链开发更轻松, 巧妙处理、提高效率，所需的工具尽在于此',
				},
			],
		}
	},
	data() {
		return {
			tool_list: [
            {
                title: this.$t('home.tool_list[0].title'),
                detail: this.$t('home.tool_list[0].detail'),
                router: '/unitConvert',
                url: require('../assets/imgs/tool_list1.png'),
            },
            {
             title: this.$t('home.tool_list[1].title'),
                detail: this.$t('home.tool_list[1].detail'),
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
     title: this.$t('home.tool_list[2].title'),
                detail: this.$t('home.tool_list[2].detail'),
                router: '/traceview',
                url: require('../assets/imgs/tool_list4.png'),
            },
            {
                  title: this.$t('home.tool_list[3].title'),
                detail: this.$t('home.tool_list[3].detail'),
                router: '/abi',
                url: require('../assets/imgs/tool_list5.png'),
            },
            {
                     title: this.$t('home.tool_list[4].title'),
                detail: this.$t('home.tool_list[4].detail'),
                router: '/address',
                url: require('../assets/imgs/tool_list6.png'),
            },
            {
                    title: this.$t('home.tool_list[5].title'),
                detail: this.$t('home.tool_list[5].detail'),
                router: '/generateWallet',
                url: require('../assets/imgs/tool_list8.png'),
            },
            {
                     title: this.$t('home.tool_list[6].title'),
                detail: this.$t('home.tool_list[6].detail'),
                router: '/querySelector',
                url: require('../assets/imgs/tool_list7.png'),
            },
            {
                     title: this.$t('home.tool_list[7].title'),
                detail: this.$t('home.tool_list[7].detail'),
                router: '/topicID',
                url: require('../assets/imgs/tool_list9.png'),
            },
            {
                    title: this.$t('home.tool_list[8].title'),
                detail: this.$t('home.tool_list[8].detail'),
                router: '/hashTool',
                url: require('../assets/imgs/tool_list10.png'),
            },
            {
                    title: this.$t('home.tool_list[9].title'),
                detail: this.$t('home.tool_list[9].detail'),
                router: '/calldata',
                url: require('../assets/imgs/tool_list11.png'),
            },
            {
                     title: this.$t('home.tool_list[10].title'),
                detail: this.$t('home.tool_list[10].detail'),
                router: '/faucet',
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

.container .topTips > div {
	display: flex;
	flex-direction: column;
	gap: 20px;
	margin-top: 100px;
	max-width: 50%;
}

.container .topTips > div div:first-child {
	color: #000;
	font-weight: 700;
	font-size: 44px;
}

.container .topTips > div div:last-child {
	font-size: 50px;
	font-weight: bold;
	color: #333333;
	line-height: 75px;
}

.container .topTips > div div:last-child span {
	font-size: 56px;
	font-family: SourceHanSansCN-Bold, SourceHanSansCN;
	font-weight: bold;
	color: #2e8ff0;
	line-height: 84px;
	background: linear-gradient(313deg, #5ef4cb 0%, #19aae2 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}

.container .topTips div div {
}

.container .topTips > img {
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

.container .listTool > div {
	display: flex;
	width: 356px;
	height: 118px;
	padding: 16px 24px;
	box-sizing: border-box;
	background-color: #fafafa;
	cursor: pointer;
}

.container .listTool > div:hover {
	background-color: #f5f5f5;
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
	border: none;
}

.theFeedback a {
	width: 56px;
	height: 20px;
	font-size: 14px;
	color: #ffffff;
}

.summary {
	color: #0e1f59;
}
</style>