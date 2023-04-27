<template>
	<div class="faucet">
		<Navigation></Navigation>
		<div class="main">
			<h3 class="title">{{$t("title.faucet")}}</h3>
			<div class="tips">
				<span>{{$t("faucet.prompt[0]")}}<br>
					{{$t("faucet.prompt[1]")}}<br>
					{{$t("faucet.prompt[2]")}}<a href="https://github.com/ChainToolDao/chaintool-frontend/blob/main/src/faucetData.json" target="_blank">{{$t("faucet.prompt[3]")}}</a> {{$t("faucet.prompt[4]")}} <a href="https://github.com/ChainToolDao/chaintool-frontend/issues/3" target="_blank">{{$t("faucet.prompt[5]")}}</a> {{$t("faucet.prompt[6]")}}<br></span>
			</div>
			<div class="content" id="content">
				<div class="content-list" v-for="item,index in faucetData" :key=item.chainID :id="item.network">
					<div class="containe" v-if="item.chainID!=''&& item.chainID!=undefined">
						<div class="network"><img :src="require('../assets/imgs/'+item.img) " alt="">{{item.network}}
						</div>
						<div class="remark">{{item.remark}}</div>
						<table>
							<tr>
								<td>Chain ID</td>
								<td>{{$t("faucet.currency")}}</td>
							</tr>
							<tr>
								<td>{{item.chainID}}</td>
								<td>{{item.currency}}</td>
							</tr>
						</table>
						<div class="expand" @click="expand(item,index,false)" :class="item.chainID"><span><img src="../assets/imgs/dropDown.png" alt="" :id="item.chainID"></span></div>
					</div>
					<div v-else class="list" id="list" :style="{'--width' : width}">
						<el-table :data="item" border stripe>
							<el-table-column :label="$t('faucet.url')">
								<template slot-scope="scope">
									<span style="margin-left: 10px">{{ scope.row.url }}</span>
								</template>
							</el-table-column>
							<el-table-column :label="$t('faucet.remark')">
								<template slot-scope="scope">
									<span style="margin-left: 10px">{{ scope.row.remark }}</span>
								</template>
							</el-table-column>
							<el-table-column :label="$t('faucet.operate')">
								<template slot-scope="scope">
									<el-button size="mini" @click="openUrl(scope.$index, scope.row)">{{ $t('faucet.receive')}}</el-button>
									<el-button size="mini" @click="copyUrl(scope.$index, scope.row)" class="copy">{{ $t('faucet.copyUrl')}}</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Navigation from '../components/Navigation.vue'
import { faucetData } from '../faucetData.js'
import Clipboard from 'clipboard'

export default {
	name: 'faucet',
	components: {
		Navigation,
	},

	metaInfo() {
		return {
			title: 'Chaintool - ' + this.title,

			meta: [
				{
					name: 'keyword',
					content: '测试网水龙头测试币获取',
				},
			],
		}
	},

	watch: {
		'$i18n.locale'() {
			this.init()
		},
	},

	data() {
		return {
			width: '1300px',
			// 水龙头数据
			faucetData: faucetData(this),
			// 打开列表的ChaintID
			ChainID: false,
			// 序号
			serialNumber: false,
			// 屏幕宽度
			screenWidth: null,
			//记录打开的value值
			listValue: {},
			//记录上次点击的序号
			index: '',
		}
	},

	async mounted() {
		this.delectList()
		this.screenWidth = document.body.clientWidth
		window.onresize = () => {
			return (() => {
				this.screenWidth = document.body.clientWidth
				if (this.ChainID != false) {
					this.expand(this.listValue, this.index - 1, true)
				}
			})()
		}
		if (window.location.hash != '') {
			let url = window.location.hash
			// %20转换为空格
			url = url.replace(/%20/g, ' ').substring(1, url.length)
			for (let i in this.faucetData) {
				if (this.faucetData[i].network == url) {
					this.expand(this.faucetData[i], i, false)
				}
			}
		}
	},

	computed: {
		title() {
			return this.$t('title.faucet')
		},
	},

	methods: {
		//初始化数据
		init() {
			this.faucetData = faucetData(this)
		},

		//打开网址
		openUrl(index, row) {
			window.open(row.url, '_blank')
		},

		//复制网址
		copyUrl(index, row) {
			this.copy(row.url, this.$t('faucet.copyURLSuccessfully'), '.copy')
		},

		// 更改滚动条
		changeScrollbar(position) {
			document.documentElement.scrollTop = position
		},

		//判断是否为微信内置浏览器
		isWeixinBrowser() {
			let ua = navigator.userAgent.toLowerCase()
			return /micromessenger/.test(ua) ? true : false
		},

		//展开列表
		async expand(value, index, isWidthChanges) {
			let position = document.documentElement.scrollTop
			setTimeout(() => {
				this.changeScrollbar(position)
			}, 1)
			//微信浏览器端刷新页面
			let url = window.location.hash
			url = url.replace(/%20/g, ' ').substring(1, url.length)
			if (url != value.network && this.isWeixinBrowser()) {
				window.location.hash = value.network
				location.reload()
			}
			window.location.hash = value.network
			if (this.ChainID) {
				//关闭上次打开的列表
				let box = document.getElementById(this.ChainID)
				box.style.transform = 'rotate(0deg)'
				//删除上次打开列表添加的数据
				if (index > this.serialNumber) {
					index--
				}
				this.faucetData.splice(this.serialNumber, 1)
			}
			//上次打开的内容，在执行关闭后就返回
			if (value.chainID == this.ChainID && !isWidthChanges) {
				this.ChainID = false
				this.listValue = false
				this.index = ''
				window.location.hash = ''
				return
			}
			//修改图标
			let box = document.getElementById(value.chainID)
			box.style.transition = '0.3s'
			box.style.transform = 'rotate(180deg)'
			//记录打开的列表的chainID
			this.ChainID = value.chainID
			//添加数组
			await this.addList(value, parseInt(index) + 1)
		},

		//清理列表
		delectList() {
			for (let i in this.faucetData) {
				if (this.faucetData[i].length != undefined) {
					this.faucetData.splice(i, 1)
				}
			}
		},

		// 添加列表
		addList(value, index) {
			let data = [index]
			this.index = data[0]
			let box = document.getElementById('content')
			let width = box.offsetWidth
			// 板块(取整)
			let plate = (box.offsetWidth / 400) | 0
			if (index % plate != 0 && plate != 0) {
				if (index + plate - (index % plate) > this.faucetData.length) {
					index = this.faucetData.length
				} else {
					index = index + plate - (index % plate)
				}
			}
			this.faucetData.splice(index, 0, value.faucet)
			//记录添加数据的位置
			this.serialNumber = index
			this.width = width + 'px'
			this.listValue = value
		},

		//调用复制的方法
		async copy(text, output, className) {
			const clipboard = new Clipboard(className, {
				text: () => {
					return text
				},
			})
			clipboard.on('success', () => {
				this.$message.success(output)
				clipboard.destroy()
			})
			clipboard.on('error', () => {
				this.$message.error(this.$t('pubilc.copySauccessfully'))
				clipboard.destroy()
			})
		},
	},
}
</script>

<style scoped>
.faucet {
	width: 100%;
	height: auto;
	min-height: 92%;
	margin-bottom: 20px;
}

.main {
	width: 95%;
	height: auto;
	background-color: #ffffff;
	border-radius: 15px;
	margin: 0 auto 30px 0 ;
	padding: 40px;
}

.main .title {
	text-align: center;
}

.content {
	margin: 0 auto;
	width: auto;
}

@media (min-width: 2310px) {
	.content {
		width: 2100px;
	}
}

@media (max-width: 2309px) {
	.content {
		width: 1680px;
	}
}

@media (max-width: 1867px) {
	.content {
		width: 1260px;
	}
}

@media (max-width: 1425px) {
	.content {
		width: 840px;
	}
}

@media (max-width: 983px) {
	.content {
		width: 400px;
	}
}

.content div {
	display: inline-block;
}

.containe {
	width: 400px;
	height: 197px;
	display: inline-block;
	margin-right: 20px;
	margin-top: 30px;
	border-radius: 10px;
	padding: 23px 23px 0 23px;
	background-color: #f2f2f2;
	vertical-align: top;
	position: relative;
}

.title span a {
	text-decoration: none;
	cursor: pointer;
	position: absolute;
	font-size: 15px;
	margin-left: 5%;
	margin-bottom: 0px;
	margin-top: 10px;
	color: #909399;
	width: 90px;
	display: inline-block;
}

.title span a:hover {
	color: #409eff;
}

.title span img {
	margin-bottom: -3px;
	width: 15px;
	display: inline-block;
}

.tips {
	width: 100%;
	text-align: center;
	margin-bottom: 20px;
	color: #a5a5a5;
	font-size: 15px;
}

.tips span a {
	color: #409eff;
	text-decoration: none;
}

.tips span a:hover {
	color: #0080ff;
}

.containe .network {
	width: 354px;
	height: 30px;
	text-align: center;
	font-size: 22px;
	margin: 0 auto;
}

.containe .network img {
	filter: invert(6%);
	width: 26px;
	height: 26px;
	margin-bottom: -5px;
	margin-right: 10px;
	border-radius: 13px;
}

.containe table tr:first-child {
	color: #797979;
}

.containe table tr td {
	width: 170px;
	display: inline-block;
	text-align: center;
	margin-top: 10px;
}

.expand {
	margin-bottom: 5px;
	position: absolute;
	bottom: 9px;
	left: 100px;
	width: 200px;
	height: 32px;
	padding: 8px 0;
	text-align: center;
}

.expand:hover {
	background-color: rgb(218, 218, 218);
	border-radius: 100px;
	cursor: pointer;
}

.expand span {
	font-size: 18px;
	display: inline-block;
}

.expand span img {
	width: 20px;
	height: 20px;
	font-size: 18px;
	display: inline-block;
}
.column {
	bottom: 50px;
	position: absolute;
}

.list {
	width: var(--width);
	margin-top: 15px;
}

.remark {
	width: 354px;
	height: 20px;
	text-align: center;
	color: #909399;
	font-size: 15px;
}

@media (max-width: 983px) {
	.el-button + .el-button,
	.el-checkbox.is-bordered + .el-checkbox.is-bordered {
		margin-left: 0px;
		margin-top: 10px;
	}
}

@media (max-width: 500px) {
	.content {
		width: 100%;
	}
	.containe {
		width: 100%;
		padding: 9px 9px 0 9px;
	}
	.containe .network {
		width: 100%;
	}
	.remark {
		width: 100%;
	}
	table tr {
		width: 50%;
	}
	.containe table tr td {
		width: 48%;
	}
	.expand {
		left: 10%;
	}
	.el-button--mini {
		padding: 7px 7px;
	}
	.content-list {
		width: 100%;
	}
	table {
		width: 100%;
	}
	.expand {
		width: 84%;
		margin: 0 auto;
		margin-top: 30px;
		position: relative;
	}
}
@media (max-width: 358px) {
	.containe {
		height: 220px;
	}
}
</style>