<template>
	<div class="generateWallet" v-loading="loading">
		<Navigation></Navigation>
		<div class="wallet">
			<div class="container">
				<h3 class="title">{{$t('title.generateWallet')}} </h3>
				<div class="usingHelp"><span><a href="https://github.com/ChainToolDao/chaintool-frontend/wiki/%E6%89%B9%E9%87%8F%E7%94%9F%E6%88%90EVM%E9%92%B1%E5%8C%85" target="_blank">{{$t("pubilc.usingHelp")}} <img src="../assets/imgs/explain.png" alt=""></a></span></div>
				<div class="tips">
					<span> {{$t('generateWallet.tips[0]')}}<a href="https://github.com/ChainToolDao" target="_blank">{{$t('generateWallet.tips[1]')}}</a>{{$t('generateWallet.tips[2]')}}<br></span>
				</div>
				<div>
					<el-radio v-model="generateMethod" label="randomBatch" @change="emptyWalletData">{{$t('generateWallet.randomBatch')}}</el-radio>
					<el-radio v-model="generateMethod" label="customize" @change="emptyWalletData">{{$t('generateWallet.customize')}}</el-radio>
				</div>
				<div v-if="generateMethod == 'randomBatch'">
					<div>
						<h5>{{$t('generateWallet.mnemonicLength')}}</h5>
					</div>
					<div>
						<el-radio v-model="mnemonicLength" label="12" border size="medium">12</el-radio>
						<el-radio v-model="mnemonicLength" label="15" border size="medium">15</el-radio>
						<el-radio v-model="mnemonicLength" label="18" border size="medium">18</el-radio>
						<el-radio v-model="mnemonicLength" label="21" border size="medium">21</el-radio>
						<el-radio v-model="mnemonicLength" label="24" border size="medium">24</el-radio>
					</div>
					<div>
						<h5>{{$t('generateWallet.quantity')}}</h5>
					</div>
					<div>
						<div>
							<el-input v-model="walletQuantity" :placeholder="$t('generateWallet.walletsNumber')"></el-input>
							<el-button v-if="!hasBuildState" @click="generateWallet()">{{$t('generateWallet.btnGenerateImmediately')}}</el-button>
							<el-button v-if="hasBuildState" @click="generateWallet">{{$t('generateWallet.regenerate')}}</el-button>
							<el-button v-if="hasBuildState" @click="exportexcel">{{$t('generateWallet.exportexcel')}}</el-button>
						</div>
					</div>
				</div>
				<div v-if="generateMethod == 'customize'">
					<div>
						<h5>{{$t('generateWallet.subtitle')}}</h5>
					</div>
					<div>
						<div>
							<el-input v-model="inputPrivateKey" :placeholder="$t('generateWallet.enterPrompt')"></el-input>
							<el-button @click="createWallet()">{{$t('generateWallet.createNow')}}</el-button>
						</div>
					</div>
				</div>
				<div class="scroll">
					<div class="data" v-for="(data, index) in walletdata" :key="index">
						<div>
							<h5>
								<span class="dataTitle"> {{$t('generateWallet.address')}}</span><span class="verticalLine"></span>
								<span class="dataBox">
									<el-popover placement="bottom-start" width="200" trigger="hover">
										<div style="text-align: left; margin: 0">
											<div v-for="item in network" :key="item.chainID">
												<el-button type="primary" v-if="item.chainID!='31337'" size="mini" class="btnPopover" @click="lookOverEtherscan(item.chainExplorer,data.address)">{{ item.networkName }}{{$t('generateWallet.popoverBtnLookOver')}}</el-button>
											</div>
										</div>
										<span class="roll" slot="reference">{{ data.address }}</span>
									</el-popover>
								</span><span class="dataReplication" @click="copy(data.address)">{{$t('pubilc.copy')}}</span>
							</h5>
							<h5>
								<span class="dataTitle">{{$t('generateWallet.mnemonic')}}</span><span class="verticalLine"></span>
								<span class="dataBox"><span class="roll">{{ data.mnemonic }}</span></span><span class="dataReplication" @click="copy(data.mnemonic)">{{$t('pubilc.copy')}}</span>
							</h5>
							<h5>
								<span class="dataTitle">{{$t('generateWallet.privateKey')}}</span><span class="verticalLine"></span>
								<span class="dataBox"><span class="roll">{{ data.privateKey }}</span></span>
								<span class="dataReplication" @click="copy(data.privateKey)">{{$t('pubilc.copy')}}</span>
							</h5>
						</div>
					</div>
				</div>
				<el-table :data="walletdata" class="el-table" id="outExcel">
					<el-table-column prop="address" :label="$t('generateWallet.address')"> </el-table-column>
					<el-table-column prop="mnemonic" :label="$t('generateWallet.mnemonic')"> </el-table-column>
					<el-table-column prop="privateKey" :label="$t('generateWallet.privateKey')"> </el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>
<script>
import Navigation from '../components/Navigation.vue'
import Clipboard from 'clipboard'
import { ethers } from 'ethers'
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import network from '../network.json'

export default {
	name: 'generateWallet',
	components: {
		Navigation,
	},
	metaInfo() {
		return {
			title: 'Chaintool - ' + this.title,

			meta: [
				{
					name: 'keyword',
					content: '生成 EVM 钱包,批量生成 EVM 钱包',
				},
			],
		}
	},
	data() {
		return {
			//钱包数量
			walletQuantity: '1',
			//助记词长度
			mnemonicLength: '12',
			//有生成状态
			hasBuildState: false,
			//钱包数据
			walletdata: [],
			//加载中
			loading: false,
			//生成方式
			generateMethod: 'randomBatch',
			inputPrivateKey: '',
			//网络
			network: network,
		}
	},

	computed: {
		title() {
			return this.$t('title.generateWallet')
		},
	},

	methods: {
		//查看Etherscan
		lookOverEtherscan(url, address) {
			window.open(url + 'address/' + address, '_blank')
		},

		//清空钱包数据
		emptyWalletData: function () {
			this.walletdata = []
		},

		//生成钱包数据
		generateWalletData() {
			this.walletdata = []
			if (!this.mnemonicLength || !this.walletQuantity) {
				this.$message({
					message: this.$t('generateWallet.nullErrorPrompt'),
					type: 'warning',
				})
				this.loading = !this.loading
				return
			} else {
				this.walletQuantity = parseInt(this.walletQuantity)
				if (!this.walletQuantity || this.walletQuantity < 1) {
					this.$message({
						message: this.$t('generateWallet.IllegalErrorPrompt'),
						type: 'warning',
					})
					this.walletQuantity = ''
					this.loading = !this.loading
					return
				}
				if (this.walletQuantity > 100) {
					this.$message({
						message: this.$t('generateWallet.beyondErrorPrompt'),
						type: 'warning',
					})
					this.walletQuantity = ''
					this.loading = !this.loading
					return
				}
				for (let i = 0; i < this.walletQuantity; i++) {
					let mnemonicLength =
						((this.mnemonicLength - 12) / 3) * 4 + 16
					var mnemonic = ethers.utils.entropyToMnemonic(
						ethers.utils.randomBytes(mnemonicLength)
					) // 生成助记词
					var path = "m/44'/60'/0'/0/0"
					var wallet = ethers.Wallet.fromMnemonic(mnemonic, path) //通过助记词创建钱包
					this.hasBuildState = true
					var wallet = {
						address: wallet.address,
						mnemonic: mnemonic,
						privateKey: wallet.privateKey,
					}
					this.walletdata.push(wallet)
				}
				this.loading = !this.loading
			}
		},

		//导出excel
		exportexcel() {
			/** 从表生成工作簿对象*/
			const wb = XLSX.utils.table_to_book(
				document.querySelector('#outExcel'),
				{
					raw: true,
				}
			)
			/** 获取二进制字符串作为输出 */
			const wbout = XLSX.write(wb, {
				bookType: 'xlsx',
				bookSST: true,
				type: 'array',
			})
			try {
				FileSaver.saveAs(
					new Blob([wbout], { type: 'application/octet-stream' }),
					//设置导出文件名称
					'EVM钱包.xlsx'
				)
			} catch (e) {}
			return wbout
		},

		//生成钱包
		generateWallet() {
			this.loading = !this.loading
			let that = this
			setTimeout(function () {
				that.generateWalletData()
			}, 30)
		},

		//通过私钥或助记词创建钱包
		createWallet() {
			this.walletdata = []
			try {
				// 通过助记词创建钱包对象
				var path = "m/44'/60'/0'/0/0"
				var wallet = ethers.Wallet.fromMnemonic(
					this.inputPrivateKey,
					path
				)
				var wallet = {
					address: wallet.address,
					mnemonic: wallet.mnemonic.phrase,
					privateKey: wallet.privateKey,
				}
				this.walletdata.push(wallet)
				return
			} catch (error) {}
			try {
				// 通过私钥创建钱包对象
				if (this.inputPrivateKey.substring(0, 2) !== '0x') {
					this.inputPrivateKey = '0x' + this.inputPrivateKey
				}
				var wallet = new ethers.Wallet(this.inputPrivateKey)
				var wallet = {
					address: wallet.address,
					mnemonic: wallet.mnemonic,
					privateKey: wallet.privateKey,
				}
				this.walletdata.push(wallet)
			} catch (error) {
				this.inputPrivateKey = ''
				this.$message.error(this.$t('generateWallet.inputErrorPrompt'))
			}
		},

		copy(text) {
			const clipboard = new Clipboard('.dataReplication', {
				text: () => {
					return text
				},
			})
			clipboard.on('success', () => {
				this.$message.success(this.$t('pubilc.copySauccessfully'))
				clipboard.destroy()
			})
			clipboard.on('error', () => {
				this.$message.error(this.$t('pubilc.copyFailed'))
				clipboard.destroy()
			})
		},
	},
}
</script>

<style scoped>
.generateWallet {
	width: 100%;
	height: auto;
	min-height: 94%;
}

.wallet {
	height: auto;
	display: flex;
	justify-content: center;
	overflow: auto;
}

.container {
	max-width: 768px;
	padding: 32px;
	width: 100%;
	height: min-content;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 30px 20px;
	background-color: #fff;
	border-radius: 8px;
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.container div {
	width: 100%;
}

.container div div {
	display: flex;
	flex-wrap: nowrap;
}

.title {
	font-size: 18px;
	font-weight: 700;
	margin-bottom: 15px;
	position: relative;
}

.usingHelp {
	width: 100%;
	height: 21px;
	margin-bottom: 15px;
}

.usingHelp span {
	float: right;
}

.usingHelp span a {
	text-decoration: none;
	cursor: pointer;
	font-size: 15px;
	color: #909399;
	width: 90px;
	display: inline-block;
}

.usingHelp span a:hover {
	color: #409eff;
}

.usingHelp span img {
	margin-bottom: -3px;
	width: 15px;
	display: inline-block;
}

.container div div .el-input {
	width: 100%;
	margin-right: 0px;
}

/deep/ .container div .el-input input {
	padding: 0 15px !important;
	-webkit-appearance: none;
	background-color: #fff;
	background-image: none;
	border-radius: 4px;
	border: 1px solid #dcdfe6;
	box-sizing: border-box;
	color: #606266;
	display: inline-block;
	height: 40px;
	line-height: 40px;
	outline: 0;
	padding: 0 0px;
	transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
	width: 100%;
	border: none;
	background-color: #f5f5f5;
	border-radius: 6px;
	width: 95%;
	margin-right: 20px;
	margin-bottom: 20px;
}

.container .el-button {
	width: 96px;
	height: 36px;
	cursor: pointer;
	font-size: 14px;
	font-weight: 700;
	border-radius: 6px;
	display: flex;
	padding: 0;
	line-height: 36px;
	justify-content: center;
	color: #fff;
	background-color: #409eff;
	border-color: #409eff;
}

.container h3 {
	font-size: 18px;
	font-weight: 700;
}

.container h5 {
	margin: 10px 0;
	font-size: 14px;
	color: #000;
	font-weight: 700;
}

.container .result {
	width: 100%;
	margin-left: 10px;
}

.el-radio.is-bordered + .el-radio.is-bordered {
	margin-left: 0px;
	margin-bottom: 10px;
}

.stateCopy {
	width: 15px;
	height: 15px;
	margin-left: 10px;
}

.scroll {
	height: auto;
	max-height: 500px;
	overflow: auto;
}

.data {
	min-width: 690px;
	overflow: hidden;
	padding-left: 10px;
	height: auto;
	margin: 15px 0;
}

.data div {
	flex-direction: column;
}

.data div h5 {
	background-color: #f0f0f0;
	height: 40px;
	margin: 2px 0;
}

.data div h5 span {
	display: inline-block;
	color: #000;
}

.data div .dataTitle {
	font-weight: 300;
	float: left;
	padding: 0;
	display: inline-block;
	text-align: center;
	width: 77px;
	height: 40px;
	line-height: 33px;
	margin: 5px 0;
	color: #da2121;
}

.container .tips {
	width: 100%;
	text-align: center;
	margin-bottom: 20px;
	color: #ff9f37;
	font-size: 15px;
}

.container .tips span a {
	color: #ff9f37;
	text-decoration: none;
}

.container .tips span a:hover {
	color: #409eff;
}

.data div .dataBox {
	font-weight: 350;
	padding-top: 13px;
	width: 520px;
	height: 47px;
	word-break: keep-all;
	overflow-x: scroll;
}

.data div .dataBox .roll {
	white-space: nowrap;
	width: auto;
}

.data div .dataReplication {
	width: 67px;
	height: 38px;
	line-height: 38px;
	text-align: center;
	float: right;
	color: #1d4ed8;
	border: 1px solid #e9e9e9;
	background-color: #ffffff;
}

.data div .verticalLine {
	float: left;
	margin-right: 10px;
	height: 38px;
	border: solid 1px rgb(221, 221, 221);
}

.el-table {
	position: absolute;
	left: -5000px;
}

.stateCopy {
	width: 15px;
	height: 15px;
	margin-left: 10px;
}

.btnPopover {
	margin: 5px;
}

@media (max-width: 500px) {
	.container div div {
		flex-wrap: wrap;
	}
}
</style>