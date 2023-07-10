<template>
	<div class="generateWallet" v-loading="loading">
		<div class="wallet">
			<div class="container">
				<el-menu class="el-menu-demo" mode="horizontal" default-active="BTC">
					<router-link to="/generateWallet/evmWallet"><el-menu-item index="EVM">{{ $t('home.EVMWalletGenerator') }}</el-menu-item></router-link>
					<router-link to="/generateWallet/btcWallet"><el-menu-item index="BTC">{{ $t('home.toolList[11].title') }}</el-menu-item></router-link>
				</el-menu>
				<h3 class="title"> {{$t('home.toolList[11].title')}} </h3>
				<div class="usingHelp"><span><a href="https://github.com/ChainToolDao/chaintool-frontend/wiki/%E6%89%B9%E9%87%8F%E7%94%9F%E6%88%90BTC%E9%92%B1%E5%8C%85" target="_blank">{{$t("pubilc.usingHelp")}} <img src="../../assets/imgs/explain.png" alt=""></a></span></div>
				<div class="tips">
					<span> {{$t('generateWallet.tips[0]')}}<a href="https://github.com/ChainToolDao" target="_blank">{{$t('generateWallet.tips[1]')}}</a>{{$t('generateWallet.tips[2]')}}<br></span>
				</div>
				<div>
					<el-radio v-model="generateMethod" label="randomBatchSame" @change="emptyWalletData">{{$t('generateWallet.randomBatch')}}({{$t('generateWallet.options[0]')}})</el-radio>
					<el-radio v-model="generateMethod" label="randomBatchDifferent" @change="emptyWalletData">{{$t('generateWallet.randomBatch')}}({{$t('generateWallet.options[1]')}})</el-radio>
					<el-radio v-model="generateMethod" label="customize" @change="emptyWalletData">{{$t('generateWallet.options[2]')}}</el-radio>
				</div>
				<div v-if="generateMethod == 'randomBatchSame' || generateMethod == 'randomBatchDifferent' ">
					<div class="lengthSelection">
						<h5 class="subtitle">{{$t('generateWallet.mnemonicLength')}}</h5>
						<el-radio v-model="mnemonicLength" label="12" border size="medium">12</el-radio>
						<el-radio v-model="mnemonicLength" label="15" border size="medium">15</el-radio>
						<el-radio v-model="mnemonicLength" label="18" border size="medium">18</el-radio>
						<el-radio v-model="mnemonicLength" label="21" border size="medium">21</el-radio>
						<el-radio v-model="mnemonicLength" label="24" border size="medium">24</el-radio>
					</div>
				</div>
				<div v-if="generateMethod == 'customize'">
					<div class="mnemonicInput">
						<h5>{{ $t('generateWallet.subtitleMnemonicCreate') }}</h5>
					</div>
					<div>
						<div>
							<el-input v-model="inputPrivateKey" :placeholder="$t('generateWallet.enterPrompt')"></el-input>
						</div>
					</div>
				</div>
				<div>
					<div>
						<h5>{{$t('generateWallet.quantity')}}</h5>
					</div>
					<div>
						<el-input v-model="walletQuantity" :placeholder="$t('generateWallet.walletsNumber')"></el-input>
						<el-button v-if="!hasBuildState" @click="generateWallet()">{{$t('generateWallet.btnGenerateImmediately')}}</el-button>
						<el-button v-if="hasBuildState" @click="generateWallet()">{{$t('generateWallet.regenerate')}}</el-button>
						<el-button v-if="hasBuildState" @click="exportexcel">{{$t('generateWallet.exportexcel')}}</el-button>
					</div>
				</div>
				<div class="advancedOptions">
					<span>{{ $t('generateWallet.advancedOptions.title')}}</span>
					<span> <el-switch v-model="advancedOptions"></el-switch></span>
					<div v-if="advancedOptions">
						<div >
							<div class="lengthSelection" v-if="advancedOptions">
								<h5 class="subtitle">{{ $t('generateWallet.selectProtocol')}}&nbsp; &nbsp; &nbsp; </h5>
								<el-select v-model="agreement" :placeholder="$t('generateWallet.selectProtocol')">
									<el-option v-for="item in agreementData" :key="item.value" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</div>
						</div>
						<div>{{ $t('generateWallet.advancedOptions.tips[0]')}} <a href="https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki" target="_blank"> {{ $t('generateWallet.advancedOptions.tips[1]')}}</a></div>
						<div><span>{{ $t('generateWallet.advancedOptions.options[0]')}}</span><el-input class="prohibitInput" :value=agreement :disabled="true"></el-input></div>
						<div><span>{{ $t('generateWallet.advancedOptions.options[1]')}}</span><el-input class="prohibitInput" value="0" :disabled="true"></el-input></div>
						<div><span>{{ $t('generateWallet.advancedOptions.options[2]')}}</span><el-input :placeholder="$t('abi.inputPrompt')" v-model="account"></el-input></div>
						<div><span>{{ $t('generateWallet.advancedOptions.options[3]')}}</span><el-input :placeholder="$t('abi.inputPrompt')" v-model="externalorInternal"></el-input></div>
						<div><span>{{ $t('generateWallet.advancedOptions.options[4]')}}</span><el-input :placeholder="$t('abi.inputPrompt')" v-model="index"></el-input></div>
						<div><span>{{ $t('generateWallet.advancedOptions.options[5]')}}</span><el-input class="prohibitInput" v-model="derivationPath" :disabled="true"></el-input></div>
					</div>
				</div>
				<div class="scroll">
					<div class="data" v-for="(data, index) in walletdata" :key="index">
						<div>
							<h5>
								<span class="dataTitle">{{ $t('generateWallet.advancedOptions.options[5]')}}</span><span class="verticalLine"></span>
								<span class="dataBox"><span class="roll">{{ data.path }}</span></span><span class="dataReplication" @click="copy(data.path)">{{$t('pubilc.copy')}}</span>
							</h5>
							<h5>
								<span class="dataTitle">{{ $t('generateWallet.publicKey')}}</span><span class="verticalLine"></span>
								<span class="dataBox"><span class="roll">{{ data.publicKey }}</span></span><span class="dataReplication" @click="copy(data.publicKey)">{{$t('pubilc.copy')}}</span>
							</h5>
							<h5>
								<span class="dataTitle"> {{$t('generateWallet.address')}}</span><span class="verticalLine"></span>
								<span class="dataBox">
									<el-popover placement="bottom-start" width="200" trigger="hover">
										<div style="text-align: left; margin: 0">
											<div v-for="item in network" :key="item.chainID">
												<el-button type="primary" v-if="item.chainID!='31337'" size="mini" class="btnPopover">{{ item.networkName }}{{$t('generateWallet.popoverBtnClick')}}</el-button>
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
					<el-table-column prop="path" :label="$t('generateWallet.advancedOptions.options[5]')"> </el-table-column>
					<el-table-column prop="publicKey" :label="$t('generateWallet.publicKey')"> </el-table-column>
					<el-table-column prop="address" :label="$t('generateWallet.address')"> </el-table-column>
					<el-table-column prop="mnemonic" :label="$t('generateWallet.mnemonic')"> </el-table-column>
					<el-table-column prop="privateKey" :label="$t('generateWallet.privateKey')"> </el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>
<script>
import Navigation from '../../components/Navigation.vue'
import Clipboard from 'clipboard'
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import network from '../../network.json'
//下面为生成比特币钱包导入的依赖
import { networks, payments } from 'bitcoinjs-lib'
import wif from 'wif'
import BIP32Factory from 'bip32'
import { mnemonicToSeedSync } from 'bip39'
import * as ecc from 'tiny-secp256k1'

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
			generateMethod: 'randomBatchSame',
			//输入私钥
			inputPrivateKey: '',
			//网络
			network: network,
			//高级选项
			advancedOptions: false,
			//账户
			account: '0',
			//外部或内部
			externalorInternal: '0',
			//指数
			index: '0',
			//协议数据
			agreementData: [
			{ label: "BIP44", value: "44" },
			{ label: "BIP49", value: "49" },
			{ label: "BIP84", value: "84" }],
			//选择的协议
			agreement: "44"
		}
	},

	computed: {},

	computed: {
		title() {
			return this.$t('home.toolList[11].title')
		},
		//推导路径
		derivationPath() {
			return (
				"m/" +
				this.agreement
				+
				"'/0'/" +
				this.account +
				"'/" +
				this.externalorInternal +
				'/' +
				this.index
			)
		},
	},

	methods: {
		//清空钱包数据
		emptyWalletData: function () {
			this.walletdata = []
			this.hasBuildState = false
		},

		//生成钱包
		async generateWallet() {
			//判断输入内容
			let criticalResult = await this.$parent.judgmentInputContent(
				this.walletQuantity,
				this.advancedOptions,
				this.account,
				this.externalorInternal,
				this.index
			)
			if (criticalResult != true) {
				this.$message({
					message: criticalResult,
					type: 'warning',
				})
				return
			}
			if (this.walletQuantity > 100) {
				this.$message({
					message: this.$t('generateWallet.messages[0]'),
					type: 'warning',
				})
				return
			}
			if (this.walletQuantity > 50) {
				this.$message({
					message: this.$t('generateWallet.messages[1]'),
					type: 'warning',
				})
			}
			// 打开界面加载状态
			this.loading = !this.loading
			//调用生成钱包的方法
			let that = this
			//随机批量助记词相同
			if (this.generateMethod == 'randomBatchSame') {
				await setTimeout(function () {
					that.randomBatchSame()
				}, 30)
			}
			// 随机批量助记词不相同
			if (this.generateMethod == 'randomBatchDifferent') {
				setTimeout(function () {
					that.randomBatchDifferent()
				}, 30)
			}
			//自定义私钥或助记词创建
			if (this.generateMethod == 'customize') {
				setTimeout(function () {
					that.customcCreation()
				}, 30)
			}
		},

		//公钥获取地址
		publicKeyGetAddress(publicKey){
			
			if (this.agreement=="44"){
				return this.generateLegacyAddress(publicKey)
			}
			if (this.agreement=="49"){
				return this.generateP2SHAddress(publicKey)
			}
			if (this.agreement=="84"){
				return this.generateSegWitAddress(publicKey)
			}
		
		},

		// 生成比特币传统地址
		generateLegacyAddress(publicKey) {
			const  address  = payments.p2pkh({ pubkey: publicKey }).address;
			return address;
		},

		// 生成比特币P2SH地址
		generateP2SHAddress(publicKey) {
			const  address  = payments.p2sh({
			redeem: payments.p2wpkh({ pubkey: publicKey }),
			}).address;
			return address;
		},

		// 生成比特币原生隔离见证地址
		generateSegWitAddress(publicKey) {
			const  address  = payments.p2wpkh({ pubkey: publicKey }).address;
			return address;
		},


		//助记词生成钱包
		mnemonicGenerateWallet(mnemonic, i) {
			//判断用户是否打开高级选项
			let path = null
			if (this.advancedOptions) {
				path =
					"m/" + this.agreement + "'/0'/" +
					this.account +
					"'/" +
					this.externalorInternal +
					'/' +
					(parseInt(this.index) + parseInt(i))
			} else {
				path = "m/" + this.agreement + "'/0'/0'/0/" + (parseInt(0) + parseInt(i))
			}
			try {
				const seed = mnemonicToSeedSync(mnemonic)
				const btcNetwork = networks.bitcoin
				let bip32 = BIP32Factory(ecc)
				const root = bip32.fromSeed(seed, btcNetwork)
				const child = root.derivePath(path)
				let address = this.publicKeyGetAddress(child.publicKey)
				let publickey = child.publicKey.toString('hex')
				let privateKey = child.privateKey
				var privateKeyhex = new Buffer(privateKey, 'hex')
				var key = wif.encode(128, privateKeyhex, true)
				var obj = wif.decode(key)
				//将钱包添加到钱包列表
				var wallet = {
					publicKey: publickey,
					address: address,
					mnemonic: mnemonic,
					privateKey: key,
					path: path,
				}
				this.walletdata.push(wallet)
				this.hasBuildState = true
			} catch (error) {
				this.$message.error(this.$t('generateWallet.inputErrorPrompt'))
				return false
			}
		},

		//随机批量生成钱包（助记词相同）
		randomBatchSame() {
			//获取助记词
			let mnemonic = this.$parent.generateMnemonic(this.mnemonicLength)
			this.walletdata = []
			for (let i = 0; i < this.walletQuantity; i++) {
				this.mnemonicGenerateWallet(mnemonic, i)
			}
			// 关闭界面加载状态
			this.loading = !this.loading
		},

		//随机批量生成钱包（助记词不同）
		randomBatchDifferent() {
			this.walletdata = []
			for (let i = 0; i < this.walletQuantity; i++) {
				//获取助记词
				let mnemonic = this.$parent.generateMnemonic(
					this.mnemonicLength
				)
				this.mnemonicGenerateWallet(mnemonic, 0)
			}
			// 关闭界面加载状态
			this.loading = !this.loading
		},

		//自定义助记词创建
		async customcCreation() {
			this.walletdata = []
			//通过助记词创建
			for (let i = 0; i < this.walletQuantity; i++) {
				await this.mnemonicGenerateWallet(this.inputPrivateKey, i)
				if (this.walletdata.length == 0) {
					break
				}
			}
			// 关闭界面加载状态
			this.loading = !this.loading
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
					'BTC' + this.$t('pubilc.wallet') + '.xlsx'
				)
			} catch (e) {}
			return wbout
		},

		//复制
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

.container .el-menu-demo a {
	display: inline-block;
	text-decoration: none;
}

.container .el-menu-demo {
	align-self: flex-start;
	margin-bottom: 20px;
}

.container .el-menu-demo a:nth-child(2) {
	border-bottom: solid 2px #409eff;
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

.advancedOptions {
	display: flex;
	flex-wrap: wrap;
}
.advancedOptions .el-switch {
	width: 40px;
	height: 20px;
}

.advancedOptions > div > div {
	flex-wrap: nowrap !important;
	align-items: baseline;
	justify-content: center;
}

.container .advancedOptions > div {
	flex-wrap: wrap;
}

.advancedOptions > div > div > span {
	width: 100px;
	padding-right: 20px;
	text-align: right;
}

.advancedOptions > span {
	margin: 12px 3px;
	font-size: 15px;
}

.advancedOptions > div div:nth-child(1) {
	text-align: left;
	justify-content: flex-start;
	padding-bottom: 10px;
	padding-left: 5px;
	color: #909399;
}

.advancedOptions > div div:nth-child(1) a {
	color: #409eff;
	text-decoration: none;
	margin-left: 5px;
}

/deep/ .advancedOptions div .prohibitInput .el-input__inner {
	background-color: rgb(228, 228, 228);
}

.subtitle {
	margin: 5px 0;
}

.lengthSelection {
	margin: 15px 5px 0px 5px;
}

.lengthSelection h5 {
	margin-right: 8px;
}

.mnemonicInput {
	margin-top: 5px;
}

@media (max-width: 768px) {
	.container div div {
		flex-wrap: wrap;
	}
}
</style>