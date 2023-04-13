<template>
	<div class="navigation">
		<div class="container">
			<div class="btn" @click="toHome()">
				<span>
					<img class="topLogo" src="../assets/imgs/topLogo.png" alt="">
				</span>
			</div>
			<div class="rightcontainer">
				<div>
					<a href="https://github.com/ChainToolDao" target="_blank"> <img class="github" src="../assets/imgs/github.png" alt=""></a>
					<a href="https://twitter.com/NUpchain" target="_blank"> <img class="twitter" src="../assets/imgs/twitter.png" alt=""></a>
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
							<template slot="title">{{$t('navigation.nav.home')}}
							</template>
							<div></div>
						</el-collapse-item>
						<el-collapse-item :title="$t('navigation.nav.languageSelection')" name="2">
							<div @click="cutoverLang('zh')">中文</div>
							<div @click="cutoverLang('en')">English</div>
						</el-collapse-item>
						<el-collapse-item :title="$t('navigation.nav.folloUs')" name="3">
							<a href="https://github.com/ChainToolDao" target="_blank">Github</a>
							<a href="https://twitter.com/NUpchain" target="_blank">Twitter</a>
						</el-collapse-item>
					</el-collapse>
				</div>
			</transition>
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
.navigation {
	width: 100%;
	display: flex;
	justify-content: center;
	background-color: #fff;
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
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

@media (min-width: 769px) {
	.pcHide {
		display: none;
	}
}

@media (max-width: 768px) {
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
@media (max-width: 400px) {
	.container {
		margin: 0 10px;
	}
	.container .btn span img {
		width: 125px;
		height: 25px;
	}
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
@media (max-width: 375px) {
	.more {
		margin-left: 5px;
	}
	.pcHide {
		margin-right: 0px;
	}
}
</style>
