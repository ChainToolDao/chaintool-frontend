<template>
	<div class="header">
		<div class="navigation">
			<div class="container">
				<div class="btn" @click="toHome()">
					<span>
						<img class="topLogo" src="../assets/imgs/topLogo.png" alt="">
					</span>
				</div>
				<div class="nav">
					<el-menu class="el-menu-demo" mode="horizontal">
						<el-submenu index="1">
							<template slot="title">EVM</template>
							<router-link to="/faucet" class="navRouter"><el-menu-item index="2-1">{{$t('home.toolList[10].title')}}</el-menu-item></router-link>
							<router-link to="/generateWallet" class="navRouter"><el-menu-item index="2-2">{{$t('home.toolList[5].title')}}</el-menu-item></router-link>
							<router-link to="/abi" class="navRouter"><el-menu-item index="2-3">{{$t('home.toolList[3].title')}}</el-menu-item></router-link>
							<router-link to="/querySelector" class="navRouter"> <el-menu-item index="2-4">{{$t('home.toolList[6].title')}}</el-menu-item></router-link>
							<router-link to="/unitConvert" class="navRouter"> <el-menu-item index="2-5">{{$t('home.toolList[0].title')}}</el-menu-item></router-link>
							<router-link to="/bulkQuery" class="navRouter"><el-menu-item index="2-6">{{$t('home.toolList[1].title')}}</el-menu-item></router-link>
							<router-link to="/traceview" class="navRouter"> <el-menu-item index="2-7">{{$t('home.toolList[2].title')}}</el-menu-item></router-link>
							<router-link to="/address" class="navRouter"> <el-menu-item index="2-8">{{$t('home.toolList[4].title')}}</el-menu-item></router-link>
							<router-link to="/topicID" class="navRouter"> <el-menu-item index="2-9">{{$t('home.toolList[7].title')}}</el-menu-item></router-link>
							<router-link to="/hashTool" class="navRouter"><el-menu-item index="2-10">{{$t('home.toolList[8].title')}}</el-menu-item></router-link>
							<router-link to="/calldata" class="navRouter"> <el-menu-item index="2-11">{{$t('home.toolList[9].title')}}</el-menu-item></router-link>
						</el-submenu>
						<el-submenu index="2">
							<template slot="title">BTC</template>
							<router-link to="/generateWallet/btcWallet" class="navRouter"><el-menu-item index="3-1">{{$t('home.toolList[11].title')}}</el-menu-item></router-link>
						</el-submenu>
					</el-menu>
				</div>
				<div class="rightcontainer">
					<div>
						<a href="https://github.com/ChainToolDao" target="_blank"> <img class="github" src="../assets/imgs/github.png" alt=""></a>
						<a href="https://twitter.com/UpchainDAO" target="_blank"> <img class="twitter" src="../assets/imgs/twitter.png" alt=""></a>
					</div>
					<div v-if="address" class="connect connected">
						<div></div>
						<div>{{ address }}</div>
					</div>
					<div v-else class="connect" @click="login">
						<div></div>
						<div>{{$t("navigation.connectWallet")}}</div>
					</div>
					<el-select v-model="lang" @change="cutoverLang(lang)" class="lang">
						<el-option label="中文" value="zh"></el-option>
						<el-option label="English" value="en"></el-option>
					</el-select>
				</div>
				<div class="more pcHide" @click="show = !show">
					<div><img src="../assets/imgs/more.png" alt=""></div>
				</div>
				<div class="pcHide wallet">
					<div v-if="address" class="connect connected ">
						<div></div>
						<div>{{ address }}</div>
					</div>
					<div v-else class="connect" @click="login">
						<div></div>
						<div>{{$t("navigation.connectWallet")}}</div>
					</div>
				</div>
				<transition name="el-zoom-in-top">
					<div v-show="show" class="collapse-item">
						<el-collapse accordion @change="activeNamesList">
							<el-collapse-item name="home">
								<template slot="title">{{$t('navigation.nav.home')}}</template>
								<div></div>
							</el-collapse-item>
							<el-collapse-item name="2">
								<template slot="title">EVM</template>
								<router-link to="/faucet">{{$t('home.toolList[10].title')}}</router-link>
								<router-link to="/generateWallet">{{$t('home.toolList[5].title')}}</router-link>
								<router-link to="/abi">{{$t('home.toolList[3].title')}}</router-link>
								<router-link to="/querySelector">{{$t('home.toolList[6].title')}}</router-link>
								<router-link to="/unitConvert">{{$t('home.toolList[0].title')}}</router-link>
								<router-link to="/bulkQuery">{{$t('home.toolList[1].title')}}</router-link>
								<router-link to="/traceview">{{$t('home.toolList[2].title')}}</router-link>
								<router-link to="/address">{{$t('home.toolList[4].title')}}</router-link>
								<router-link to="/topicID">{{$t('home.toolList[7].title')}}</router-link>
								<router-link to="/hashTool">{{$t('home.toolList[8].title')}}</router-link>
								<router-link to="/calldata">{{$t('home.toolList[9].title')}}</router-link>
							</el-collapse-item>
							<el-collapse-item name="3">
								<template slot="title">BTC</template>
								<router-link to="/generateWallet/btcWallet">{{$t('home.toolList[11].title')}}</router-link>
							</el-collapse-item>
							<el-collapse-item :title="$t('navigation.nav.languageSelection')" name="4">
								<div @click="cutoverLang('zh')">中文</div>
								<div @click="cutoverLang('en')">English</div>
							</el-collapse-item>
							<el-collapse-item :title="$t('navigation.nav.folloUs')" name="5">
								<a href="https://github.com/ChainToolDao" target="_blank">Github</a>
								<a href="https://twitter.com/UpchainDAO" target="_blank">Twitter</a>
							</el-collapse-item>
						</el-collapse>
					</div>
				</transition>
			</div>
		</div>
		<div class="sponsorshipBanner">
			<span>
				<a href="https://explorer.gitcoin.co/#/round/1/0xaa40e2e5c8df03d792a52b5458959c320f86ca18/0xaa40e2e5c8df03d792a52b5458959c320f86ca18-95">在 Gitcoin Grant 为登链社区捐赠, 支持社区发展 >></a>
				<a href="https://explorer.gitcoin.co/#/round/1/0xaa40e2e5c8df03d792a52b5458959c320f86ca18/0xaa40e2e5c8df03d792a52b5458959c320f86ca18-95">在 Gitcoin Grant 支持社区</a>
			</span>
		</div>
	</div>
</template>

<script>
import { ethers } from 'ethers'
import Proxy from '../proxy.js'

export default {
	name: 'Navigation',
	data() {
		return {
			address: null,
			lang: 'zh',
			//控制列表的展示
			show: false,
		}
	},

	computed: {
		account() {
			return this.$store.state.account
		},
	},

	async created() {
		if (localStorage.getItem('lang') != null) {
			this.$i18n.locale = localStorage.getItem('lang')
		} else {
			let lan = navigator.systemLanguage || navigator.language
			if (lan.toLowerCase().indexOf('zh') !== -1) {
				this.$i18n.locale = 'zh'
			} else if (lan.toLowerCase().indexOf('en') !== -1) {
				this.$i18n.locale = 'en'
			}
		}
		this.lang = this.$i18n.locale
		if (this.account) {
			this.address = this.formatAccount(this.account)
		}
	},

	async mounted() {
		let that = this
		try {
			window.ethereum.on('accountsChanged', function (accounts) {
				that.address = that.formatAccount(accounts[0])
			})
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			const owner = provider.getSigner()
			this.address = this.formatAccount(await owner.getAddress())
		} catch (error) {}
	},

	methods: {
		async login() {
			let loginStatus = await Proxy.initWeb3Account(
				async (web3Provider) => {
					if (web3Provider) {
						web3Provider.on('accountsChanged', (accounts) => {
							if (accounts[0]) {
								this.address = this.formatAccount(accounts[0])
								this.$store.commit('updataAccount', accounts[0])
							} else {
								this.address = null
								this.$store.commit('updataAccount', null)
							}
						})
						let provider = new ethers.providers.Web3Provider(
							web3Provider
						)
						try {
							let account = await provider
								.getSigner()
								.getAddress()
							this.$store.commit('updataAccount', account)
							this.address = this.formatAccount(account)
						} catch (error) {}
					}
				},
				this
			)
		},

		//切换语言
		cutoverLang(lang) {
			this.lang = lang
			this.$i18n.locale = lang
			localStorage.setItem('lang', lang)
		},

		formatAccount(acc) {
			let accLeft = acc.substring(0, 5)
			let accRight = acc.substr(-5)
			return `${accLeft}...${accRight}`
		},

		toHome() {
			this.$router.push('/')
		},

		activeNamesList(activeNames) {
			if (activeNames == 'home') {
				this.$router.push('/')
				this.$router.go(0)
			}
		},
	},
}
</script>

<style scoped>
.header {
	width: 100%;
}

.navigation {
	width: 100%;
	display: flex;
	justify-content: center;
	background-color: #fff;
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.sponsorshipBanner {
	width: calc(100vw - 40px);
	max-width: 1280px;
	height: auto;
	background-color: #f9c456;
	margin: 10px auto;
	border-radius: 7px;
	padding: 6px 20px 6px 20px;
	text-align: center;
	box-shadow: 0 4px 7px 0 rgba(0, 0, 0, 0.05);
}

@media (max-width: 1315px) {
	.sponsorshipBanner {
		margin: 10px auto;
	}
}

.sponsorshipBanner span a {
	font-size: 14px;
	font-weight: 500;
	text-decoration: none;
}

.sponsorshipBanner span a:nth-child(2) {
	display: none;
}

.container {
	display: flex;
	width: 100%;
	height: 70px;
	max-width: 1280px;
	box-sizing: border-box;
	justify-content: space-between;
	align-items: center;
	margin: 0 20px;
}

.container .btn {
	cursor: pointer;
}

.container div span {
	font-size: 24px;
	font-weight: 500;
}

.container .connect {
	cursor: pointer;
	height: 35px;
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 0 20px;
	background-color: #eef0f3;
	border-radius: 5px;
}

.container .connect div:first-child {
	width: 16px;
	height: 16px;
	background-color: #a3a3a3;
	border-radius: 50%;
}

.container .connect div:last-child {
	font-size: 14px;
}

.container .connected div:first-child {
	background-color: #3ec93f;
}

.topLogo {
	width: 150px;
	height: 33px;
}

.github {
	width: 30px;
	height: 30px;
	margin-right: 12px;
	filter: invert(0%);
}

.twitter {
	width: 30px;
	height: 30px;
	margin-right: 12px;
	filter: invert(0%);
}

.rightcontainer {
	display: flex;
	align-items: center;
}

/deep/ .rightcontainer .lang div input {
	border: 0px solid !important;
	width: 100px !important;
	background: none !important;
	margin: 0 0 1px 0 !important;
}

/deep/ .rightcontainer .lang div span span i {
	line-height: 0px;
}

.more {
	cursor: pointer;
	float: left;
	width: 40px;
	height: 40px;
}

.more div {
	width: 22px;
	height: 22px;
	margin: 7px auto;
}

.more div img {
	width: 22px;
	height: 22px;
}

.collapse-item {
	display: none;
}

/deep/ .el-collapse-item__content {
	border: solid 1px rgb(176, 176, 176);
	border-radius: 10px;
	padding: 5px 20px 10px 20px;
}

.el-collapse-item__content div {
	margin-top: 10px;
	padding: 10px 10px 10px 15px;
}

.el-collapse-item__content div:hover {
	cursor: pointer;
	background-color: rgb(214, 214, 214);
	border-radius: 10px;
}

.el-collapse-item__content a {
	margin-top: 10px;
	margin-right: 10px;
	padding: 10px 10px 10px 15px;
	width: 93%;
	text-decoration: none;
	display: inline-block;
	color: block !important;
}

.el-collapse-item__content a:hover {
	cursor: pointer;
	background-color: rgb(214, 214, 214);
	border-radius: 10px;
}

a:-webkit-any-link {
	color: black;
}

.nav ul {
	display: flex;
	flex-wrap: nowrap;
}

@media (max-width: 400px) {
	.container {
		margin: 0 10px;
	}

	.container .btn span img {
		width: 125px;
		height: 25px;
	}
}

@media (max-width: 375px) {
	.more {
		margin-left: 5px;
	}

	.pcHide {
		margin-right: 0px;
	}
}

@media (max-width: 768px) {
	.nav {
		display: none;
	}

	.sponsorshipBanner span a:nth-child(1) {
		display: none;
	}

	.sponsorshipBanner span a:nth-child(2) {
		display: inline-block;
	}

	.navigation {
		display: inline-block;
	}

	.container {
		margin: 4px 20px;
		width: 94%;
	}

	.collapse-item {
		display: block;
	}

	.btn {
		margin: 20px 0 0 0;
		display: inline-block;
		float: left;
	}

	.rightcontainer {
		display: none;
	}

	.pcHide {
		width: auto;
		margin-top: 15px;
		margin-right: 15px;
	}

	.container {
		flex-wrap: wrap;
		height: auto;
		display: inline-block;
	}

	.container .connect {
		width: 160px;
	}

	.connect {
		width: 200px;
		float: right;
	}

	.more {
		float: right;
		margin-left: 20px;
	}

	.collapse-item {
		margin-top: 70px;
		margin-bottom: 20px;
	}
}

@media (min-width: 769px) {
	.pcHide {
		display: none;
	}

	.nav {
		width: 30%;
	}

	.nav ul li {
		display: inline-block;
	}

	.el-menu--horizontal {
		border-bottom: none;
	}

	/deep/ .nav .el-menu--horizontal > .el-submenu .el-submenu__title {
		color: black;
		font-size: 17px;
	}

	.navRouter {
		text-decoration: none;
	}
}
</style>
