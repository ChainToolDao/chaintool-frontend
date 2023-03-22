<template>
	<div class="abi">
		<Navigation></Navigation>
		<div class="scroll">
			<div class="container">
				<div class="title">ABI 可视化调用</div>
				<div class="buttons">
				</div>
				<div class="contract-list">
					<el-container class="main">
						<el-aside width="184px" class="sidebar">
							<el-menu>
								<el-button class="btn" type="primary" @click="addContract()">添加合约</el-button>
								<div v-if="localData != null">
									<div v-for="item in contractList" :key="item.network">
										<el-submenu :index=item.network>
											<template slot="title">
												<i class="el-icon-star-on"></i>
												<span class="leftTitle">{{ item.network }}</span>
											</template>
											<el-menu-item v-for="data, key in item.data" :key=key
												@click="openItem(data, item.network)">{{ data.name }}</el-menu-item>
										</el-submenu>
									</div>
								</div>
							</el-menu>
						</el-aside>
						<el-container>
							<el-main>
								<div v-if="this.clickItem.length != 0" class="shop">
									<ul>
										<li @click="shareContract(clickItem)" class="share">
											<i class="el-icon-share"></i>
											<span>分享</span>
										</li>
										<li @click="checkJSONABI" class="view">
											<i class="el-icon-view"></i>
											<span>查看ABI</span>
										</li>
										<li @click="checkEtherscan" class="paperclip">
											<i class="el-icon-paperclip"></i>
											<span>查看Etherscan</span>
										</li>
										<li @click="updateContract" class="edit">
											<i class="el-icon-edit"></i>
											<span>编辑</span>
										</li>
										<li @click="deleteContract" class="delete">
											<i class="el-icon-delete"></i>
											<span>删除</span>
										</li>
									</ul>
								</div>
								<el-table :data="tableData">
									<el-table-column prop="ItemName" label="合约名称"> </el-table-column>
									<el-table-column prop="ItemNetwork" label="区块链网络"> </el-table-column>
									<el-table-column prop="ItemAddress" label="合约地址"> </el-table-column>
								</el-table>
								<div class="sol-body">
									<div class="sol-body-left">
										<el-aside width="400px" class="column">
											<el-menu :data="tableData">
												<div v-if="tableData.length>=1">
													<template v-for="(item, index) in tableData[0].ItemAbi">
														<div @click="transferParameters(item,index)" class="contentList"
															:key=index>
															<el-submenu
																v-if="item.type == 'function' || item.type == 'view'"
																:key="index" :index="index + ''">
																<template slot="title">
																	<el-tag v-if="item.stateMutability == 'Read'"> Read
																	</el-tag>
																	<el-tag v-if="item.stateMutability == 'Write'"
																		type="warning"> Write </el-tag>
																	<el-tag v-if="item.stateMutability == 'Payable'"
																		type="danger"> Payable </el-tag>
																	<el-tag v-if="!item.stateMutability" type="warning">
																		{{ item.stateMutability }} </el-tag>
																	<span
																		class="contentList-text">{{ item.name }}</span>
																</template>
															</el-submenu>
														</div>
													</template>
												</div>
											</el-menu>
										</el-aside>
									</div>
									<div class="contentRight">
										<div class="rightList">
											<div v-if="parameter != null">
												<div class="title">调用函数： </div>
												<div class="title">{{ parameter[0].name }} </div>
												<el-table :data="parameter[0].inputs" class="list"
													v-if="parameter[0].inputs.length > 0">
													<el-table-column label="Type" width="100">
														<template slot-scope="scope">
															<span>{{ scope.row.type }}</span>
														</template>
													</el-table-column>
													<el-table-column label="Name" width="100">
														<template slot-scope="scope">
															<span>{{ scope.row.name }}</span>
														</template>
													</el-table-column>
													<el-table-column label="Value">
														<template slot-scope="scope">
															<el-input v-model="scope.row.value"></el-input>
														</template>
													</el-table-column>
												</el-table>
												<div v-if="parameter[0].stateMutability=='Payable'" class="rightInput">
													<div>
														<span>value:</span>
														<span>
															<el-input placeholder="请输入Value" v-model="overrides.value"
																class="input-with-select">
																<el-select v-model="unit" slot="prepend"
																	placeholder="请选择">
																	<el-option label="Wei" value="Wei"></el-option>
																	<el-option label="Gwei" value="Gwei"></el-option>
																	<el-option label="Ether" value="Ether"></el-option>
																</el-select>
															</el-input>
														</span>
													</div>
												</div>
												<div class="rightButton">
													<el-button type="danger" @click="clearOutput">清空输出</el-button>
													<el-button type="primary" class=""
														@click="submitAbiForm(parameter[0], parameter[1])">运行</el-button>
												</div>
											</div>
										</div>
										<div>
											<div class="sol-body-right" :data="abiCardData">
												<div v-if="abiCardData.length != 0">
													<el-card class="box-card" v-for="(item, index) in abiCardData"
														:key="index" :index="index + 'card'">
														<div slot="header" class="clearfix">
															<div><span v-if="item.typeFlag == 'error'">❌ </span>
																调用函数：{{ item.function }}</div>
														</div>
														<pre>
                                                            <span v-if="item.typeFlag == 'write'">交易详情：</span>
                                                            <span v-if="item.typeFlag=='read'||item.typeFlag=='error'">返回内容：</span>
                                                            <json-viewer :value="item.content" ></json-viewer>
                                                        </pre>
													</el-card>
												</div>
											</div>
										</div>
									</div>
								</div>
							</el-main>
						</el-container>
					</el-container>
				</div>
				<div class="dialog">
					<el-dialog title="添加合约" :visible.sync="dialogFormVisible" @close='closureInputBox'>
						<el-dialog width="45%" title="常见ABI" :visible.sync="innerVisible" append-to-body>
							<div class="innerFrame">
								<div v-for="piece in presetsABI" :key="piece.standard">
									<div class="inner-title">{{ piece.standard }}</div>
									<div>
										<ul>
											<li class="link" v-for="data  in piece.data" @click="getABI(data)"
												:key="data">{{ data
                                            }}</li>
										</ul>
									</div>
								</div>
							</div>
						</el-dialog>
						<el-form :model="form" :rules="rules" ref="form">
							<el-form-item label="项目名称" prop="name" :label-width="formLabelWidth">
								<el-input v-model="form.name" autocomplete="off" placeholder="unique name"></el-input>
							</el-form-item>
							<el-form-item label="网络" prop="network" :label-width="formLabelWidth">
								<el-select v-model="form.network" placeholder="请选择要连接的网络">
									<el-option v-for="item in network" :key="item.chainID" :label="item.networkName"
										:value="item.networkName"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="项目地址" prop="address" :label-width="formLabelWidth">
								<el-input v-model="form.address" autocomplete="off" placeholder="address"></el-input>
							</el-form-item>
							<el-form-item label="ABI" prop="abi" :label-width="formLabelWidth" class="el-textarea">
								<textarea autocomplete="off" v-model="form.abi" rows="5" v-if="hasABI"
									placeholder='[{"anonymous": false,"inputs": [],"name": "Approval","type": "event"}]'
									class="el-textarea__inner" @input="determineAbiIsEmpty"></textarea>
								<div class="popUpBox" v-if="!hasABI">
									<ul>
										<li class="upload-demo" @click="innerVisible = true"><i
												class="el-icon-folder-opened  el-icon"></i><span>选择常见ABI</span>
										</li>
										<li class="">
											<el-upload class="upload-demo"
												action="https://jsonplaceholder.typicode.com/posts/" accept=".ABI,.txt"
												:on-success="readFile"> <i
													class="el-icon-upload2 el-icon"></i><span><a>上传ABI文件</a></span>
											</el-upload>
										</li>
										<li class="upload-demo" @click="hasABI = true"><i
												class="el-icon-copy-document  el-icon"></i><span>粘贴ABI文件</span></li>
										<li class="upload-demo" @click="getABIFromEtherscan"><i
												class="el-icon-connection  el-icon"></i><span>Etherscan获取</span>
										</li>
									</ul>
								</div>
							</el-form-item>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="cancelDialog">取 消</el-button>
							<el-button type="primary" @click="onSubmit('form')">确 定</el-button>
						</div>
					</el-dialog>
					<el-dialog title="查看ABI" :visible.sync="ABIVisible" width="30%" center>
						<div class="visible">
							<el-button round @click="checkJSONABI">JSON ABI</el-button>
							<el-button round @click="checkHumanReadableABI">Human-Readable ABI</el-button>
						</div>
						<el-input type="textarea" :disabled="true" :autosize="{ minRows: 5, maxRows: 20}"
							placeholder="请输入内容" v-model="checkABI">
						</el-input>
						<span slot="footer" class="dialog-footer">
							<el-button type="primary" @click="copy(checkABI,'复制成功','.dialog-footer')">复 制</el-button>
							<el-button type="danger" @click="ABIVisible = false">退 出</el-button>
						</span>
					</el-dialog>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ethers } from 'ethers'
import Navigation from '../components/Navigation.vue'
import axios from 'axios'
import presetsABI from '../presetsABI.json'
import network from '../network.json'
import Clipboard from 'clipboard'

export default {
	name: 'abi',
	components: {
		Navigation,
	},

	metaInfo() {
		return {
			title: 'Chaintool - ABI 图形化',

			meta: [
				{
					name: 'keyword',
					content: 'ABI 图形化, ABI 可视化调用',
				},
				{
					name: 'description',
					content: '根据 ABI 自动生成可调用按钮',
				},
			],
		}
	},

	data() {
		// 表单验证 - 项目名称
		let validateName = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入项目名称'))
			} else {
				const localData = localStorage.getItem('localData')
				if (localData == '' || localData == null) callback()
				else {
					const data = JSON.parse(localData)
					for (let i = 0; i < data.length; i++) {
						if (
							data[i].name === value &&
							!(this.isUpdate && this.chooseContractName == value)
						) {
							callback(new Error('已有相同名称的项目存在！'))
						}
					}
					callback()
				}
			}
		}

		// 表单验证 - 项目地址
		let validateAddress = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入项目地址'))
			} else {
				callback()
			}
		}

		// 表单验证 - ABI
		let checkAbi = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入 ABI'))
			} else {
				callback()
			}
		}

		// 表单验证 - 网络
		let checkNetwork = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请选择网络'))
			} else {
				callback()
			}
		}

		return {
			// 定义 storage 对象，对象有get（取值）, set（设置）, add（加入新值）三个方法
			storage: {},
			// dialog控件的开启关闭属性
			dialogFormVisible: false,
			// dialog内部控件
			innerVisible: false,
			// 右侧详情栏的表格信息数据
			item: {
				ItemName: '',
				ItemNetwork: '',
				ItemAddress: '',
				ItemAbi: '',
			},
			// 右侧详情栏的表格信息数据对象
			tableData: [],
			// 右侧详情栏的ABI卡片数据 调用函数 返回内容
			abiCardData: [],
			// 所有合约的总数据对象
			localData: [],
			// 添加合约的表单对象
			form: {
				name: '',
				address: '',
				abi: '',
				network: '',
			},
			// 表单校验规则
			rules: {
				name: [{ validator: validateName, trigger: 'blur' }],
				address: [{ validator: validateAddress, trigger: 'blur' }],
				abi: [{ validator: checkAbi, trigger: 'blur' }],
				network: [{ validator: checkNetwork, trigger: 'blur' }],
			},
			// 表单子栏的宽度
			formLabelWidth: '100px',
			// 监听左侧点击的导航标题
			clickItem: {},
			// 与合约交互相关的数据定义
			accountAddress: '',
			provider: {},
			signer: {},
			// 链号
			chainId: 0,
			// 有ABI
			hasABI: false,
			// 是更新
			isUpdate: false,
			// 选择合约名称
			chooseContractName: '',
			// 参数列表
			parameter: null,
			// 预设ABI
			presetsABI: presetsABI,
			// 网络
			network: network,
			// 合约列表
			contractList: '',
			// ABI可见
			ABIVisible: false,
			overrides: {
				value: '',
			},
			// 单位
			unit: 'Wei',
			// 保存待打开页面数据
			pageData: null,
			//查看ABI
			checkABI: [],
		}
	},

	async created() {
		//初始化
		this.init()
	},

	async mounted() {
		//判断url是否携带address与currencySymbol
		if (
			this.$route.params.currencySymbol !== undefined &&
			this.$route.params.address !== undefined
		) {
			//获取所有信息，填充表单
			for (let i = 1; i < this.network.length; i++) {
				if (
					this.network[i].currencySymbol ==
					this.$route.params.currencySymbol
				) {
					this.form.network = this.network[i].networkName
					this.form.address = this.$route.params.address
					// 获取ABI
					this.form.name = await this.getABIFromEtherscan()
				}
			}
			if (this.form.abi == '') {
				this.$message.error('自动添加合约失败')
				return
			}
			//获取浏览器保存的数据，用于下面的判断
			let localData = await this.storage.get('localData')
			for (let i in localData) {
				if (
					await this.judgeObjecEquals(
						JSON.stringify(this.form),
						JSON.stringify(localData[i])
					)
				) {
					this.openItem(localData[i], localData[i].network)
					this.hasABI = false
					// 清空表单
					this.form = {
						name: '',
						address: '',
						abi: '',
						network: '',
					}
					return
				}
			}
			for (let i in localData) {
				//判断是否存在名字相同的合约
				if (this.form.name == localData[i].name) {
					this.createABI(this.form.name)
					return
				}
			}
			//创建合约
			this.createABI(this.form.name)
		}
	},

	methods: {
		//判断abi值是否为空
		determineAbiIsEmpty() {
			setTimeout(() => {
				if (this.form.abi == '') {
					this.hasABI = false
				}
			}, 300)
		},

		//创建合约
		async createABI(name) {
			this.dialogFormVisible = true
			await this.addContract()
			this.hasABI = true
			await this.onSubmit('form')
		},

		//传递参数
		transferParameters(item, index) {
			this.parameter = [item, index]
			if (
				this.parameter[0].inputs.length == 0 &&
				item.stateMutability != 'Payable'
			) {
				this.submitAbiForm(this.parameter[0], this.parameter[1])
			}
		},

		//读取文件
		readFile(response, file, fileList) {
			this.hasABI = true
			let reader = new FileReader()
			reader.readAsText(file.raw, 'UTF-8') //读取，转换字符编码
			let that = this
			reader.onload = function (e) {
				let val = e.target.result //获取数据
				let rtulist = val.split('\r\n')
				that.form.abi = rtulist
			}
		},

		//判断对象值是否相等
		judgeObjecEquals(objectA, objectB) {
			objectA = JSON.parse(objectA)
			objectB = JSON.parse(objectB)
			// 遍历对象，返回对象的属性名
			let Array = ['abi', 'address', 'network']
			for (let i in Array) {
				//判断对象的每一个属性名对应的值是否相等
				if (
					objectA[Array[i]].replace(/\s*/g, '') !=
					objectB[Array[i]].replace(/\s*/g, '')
				) {
					return false
				}
			}
			return true
		},

		//分享合约
		shareContract(Item) {
			let url
			if (Item.network == 'Hardhat(localhost)') {
				this.$message.error('当前网络暂不支持分享')
				return
			}
			for (let i in this.network) {
				if (this.network[i].networkName == Item.network) {
					url =
						'https://chaintool.tech/abi/' +
						this.network[i].currencySymbol +
						'/' +
						Item.address
					this.copy(url, '复制分享链接成功', '.shop')
				}
			}
		},

		//获取ABI
		async getABI(name) {
			try {
				await axios.get('/commonABI/' + name + '.json').then((res) => {
					this.form.abi = JSON.stringify(res.data)
				})
			} catch (err) {}
			this.hasABI = true
			this.innerVisible = false
		},

		//从Etherscan获取ABI
		async getABIFromEtherscan() {
			if (this.form.address == '' || this.form.network == '') {
				this.$message.error('请输入项目地址和输入网络后重试')
				return
			}
			//请求网络
			let requestNetwork =
				'https://anyabi.xyz/api/get-abi/' +
				this.convertChainId(this.form.network) +
				'/' +
				this.form.address
			let that = this
			let name
			try {
				await axios.get(requestNetwork).then((res) => {
					this.hasABI = true
					that.form.abi = JSON.stringify(res.data.abi)
					name = res.data.name
				})
				return name
			} catch (error) {
				this.$message.error('ABI获取失败')
			}
		},

		//读取localdata
		readLocaldata() {
			this.localData = []
			// 已添加数量
			let readQuantity = -1
			for (let i in this.storage.get('localData')) {
				for (let k in this.localData) {
					if (
						this.localData[k].network ==
						this.storage.get('localData')[i].network
					) {
						readQuantity++
						this.localData[k].data.push({
							name: this.storage.get('localData')[i].name,
							address: this.storage.get('localData')[i].address,
							abi: this.storage.get('localData')[i].abi,
						})
					}
				}
				if (readQuantity != i) {
					readQuantity++
					let abiData = {
						network: this.storage.get('localData')[i].network,
						data: [
							{
								name: this.storage.get('localData')[i].name,
								address:
									this.storage.get('localData')[i].address,
								abi: this.storage.get('localData')[i].abi,
							},
						],
					}
					this.localData.push(abiData)
				}
			}
			this.contractList = this.localData
		},

		//添加合约
		addContract() {
			this.isUpdate = false
			this.dialogFormVisible = true
		},

		// 初始化数据
		async init() {
			// 给storage 对象添加方法
			this.storage.get = this.get
			this.storage.set = this.set
			this.storage.remove = this.remove
			await this.readLocaldata()
			// 读取localdata
			this.localData = await this.storage.get('localData')
			//修改是否存在ABI的状态
			this.hasABI = false
			this.tableData = Array(1).fill(this.item)
			// 清空卡片数据
			this.abiCardData = []
			// 清空当前点击对象
			this.clickItem = []
		},

		// 取消按钮事件
		cancelDialog() {
			this.dialogFormVisible = false
		},

		// 关闭输入框
		closureInputBox() {
			this.dialogFormVisible = false
			this.hasABI = false
			// 清空表单
			this.form = {}
		},

		// localstorage的get方法
		get(name) {
			const localData = localStorage.getItem(name)
			if (localData == '' || localData == null) return null
			return JSON.parse(localData)
		},

		// localstorage的set方法
		set(name, val) {
			//将JSON.stringify(val)储存到name
			localStorage.setItem(name, JSON.stringify(val))
		},

		// localstorage的remove方法
		remove(name, target) {
			let localData = this.storage.get(name)
			if (localData.length != 0 || localData != null) {
				for (let i = 0; i < localData.length; i++) {
					if (localData[i].name === target) {
						localData.splice(i, 1)
					}
				}
			}
			// 保存删除后的localData
			this.storage.set(name, localData)
		},

		// 根据不同的network分发数据
		solveData(network) {
			let datalist = []
			if (this.localData == null) {
				return datalist
			}
			for (let i = 0; i < this.localData.length; i++) {
				if (this.localData[i].network === network) {
					datalist.push(this.localData[i])
				}
			}
			return datalist
		},

		// 添加合约 事件 提交表单
		async onSubmit(formName) {
			if (this.form.abi[1].indexOf('{') == -1) {
				const iface = new ethers.utils.Interface(eval(this.form.abi))
				const FormatTypes = ethers.utils.FormatTypes
				this.form.abi = iface.format(FormatTypes.json)
			}
			if (this.localData == null) {
				// 清空localData
				this.localData = []
			}
			// 校验规则
			await this.$refs[formName].validate(async (valid) => {
				if (valid) {
					if (await this.validABI(this.form.abi)) {
						if (!this.isUpdate) {
							this.localData.push(this.form)
						} else {
							for (let i in this.localData) {
								if (
									this.localData[i].name ==
									this.chooseContractName
								) {
									this.localData[i] = this.form
								}
							}
						}
						this.pageData = JSON.parse(JSON.stringify(this.form))
						// 保存localData到localStorage
						await this.storage.set('localData', this.localData)
						// 清空表单
						await this.$refs.form.resetFields()
						//初始化
						await this.init()
						this.isUpdate = false
						this.parameter = null
						//关闭弹出窗
						await this.closureInputBox()
						//打开页面
						await this.openItem(
							this.pageData,
							this.pageData.network
						)
					}
				} else {
					return false
				}
			})
		},

		//解析ABI 判断abi是否正确
		async validABI(abiObj) {
			if (abiObj !== '' && abiObj !== null && abiObj !== undefined) {
				try {
					abiObj = JSON.parse(abiObj)
					if (typeof abiObj !== 'object') {
						this.$message.error('ABI有误！添加失败，请检查后重试')
						return false
					}
					return abiObj
				} catch (err) {
					this.$message.error('ABI有误！添加失败，请检查后重试')
					return false
				}
			}
		},

		// 单击左侧导航栏的事件
		openItem(Item, network) {
			Item.network = network
			// 清空 abiCardData
			this.abiCardData = []
			//清空 parameter
			this.parameter = null
			// 将abi的数值转成对象
			let abiObj = JSON.parse(Item.abi)
			this.tableData = [
				{
					ItemName: Item.name,
					ItemNetwork: Item.network,
					ItemAddress: Item.address,
					ItemAbi: abiObj,
				},
			]
			//读
			let viewMethod = []
			//写
			let writeMethod = []
			let payableMethod = []
			//其他
			let otherMethod = []
			let state = ['view', 'pure', 'constant']
			for (let i = 0; i < this.tableData[0].ItemAbi.length; i++) {
				if (
					state.indexOf(
						this.tableData[0].ItemAbi[i].stateMutability
					) != -1
				) {
					this.tableData[0].ItemAbi[i].stateMutability = 'Read'
					viewMethod.push(this.tableData[0].ItemAbi[i])
				} else if (
					this.tableData[0].ItemAbi[i].stateMutability == 'nonpayable'
				) {
					this.tableData[0].ItemAbi[i].stateMutability = 'Write'
					writeMethod.push(this.tableData[0].ItemAbi[i])
				} else if (
					this.tableData[0].ItemAbi[i].stateMutability == 'payable'
				) {
					this.tableData[0].ItemAbi[i].stateMutability = 'Payable'
					payableMethod.push(this.tableData[0].ItemAbi[i])
				} else {
					otherMethod.push(this.tableData[0].ItemAbi[i])
				}
			}
			this.tableData[0].ItemAbi = []
			this.tableData[0].ItemAbi.push(...viewMethod)
			this.tableData[0].ItemAbi.push(...writeMethod)
			this.tableData[0].ItemAbi.push(...payableMethod)
			this.tableData[0].ItemAbi.push(...otherMethod)
			this.clickItem = Item
		},

		//更新合约
		updateContract() {
			if (this.clickItem.length == 0) {
				this.$message('当前暂未选择合约')
				return
			}
			this.isUpdate = true
			// 清空 abiCardData
			this.abiCardData = []
			//清空 parameter
			this.parameter = null
			this.chooseContractName = this.clickItem.name
			this.form = this.clickItem
			//打开编辑窗口
			this.dialogFormVisible = true
		},

		//查看Etherscan
		checkEtherscan() {
			if (this.clickItem.length == 0) {
				this.$message('当前暂未选择合约')
				return
			}
			for (let i in this.network) {
				if (this.clickItem.network == this.network[i].networkName) {
					if (this.network[i].chainExplorer == '') {
						this.$message('该合约Etherscan暂未被记录')
					} else {
						window.open(
							this.network[i].chainExplorer +
								'address/' +
								this.clickItem.address,
							'_blank'
						)
					}
				}
			}
		},

		// 删除合约事件
		deleteContract() {
			if (this.clickItem.length == 0) {
				this.$message('当前暂未选择合约')
				return
			}
			// 清空 abiCardData
			this.abiCardData = []
			//清空 parameter
			this.parameter = null
			if (this.clickItem.name !== undefined) {
				// 删除合约
				this.storage.remove('localData', this.clickItem.name)
				// 重新载入数据
				this.init()
			}
		},

		async connectMetaMask() {
			// 连接MetaMask
			if (window.ethereum) {
				try {
					this.accounts = await window.ethereum.enable()
					this.provider = window.ethereum
					this.signer = new ethers.providers.Web3Provider(
						this.provider
					).getSigner()
					this.chainId = parseInt(
						await window.ethereum.request({ method: 'eth_chainId' })
					)
				} catch (error) {
					this.$message.error('User denied account access', error)
				}
			} else {
				this.$message.error('Need install MetaMask')
			}
		},

		// ABI 函数 表单 提交事件
		async submitAbiForm(Item, index) {
			// 连接MetaMask
			await this.connectMetaMask()
			// Item是当前运行框 合约函数的对象 包含了函数名 函数类型 以及有多少个输入框等
			// 将abi的数值转成对象
			let abiObj = this.clickItem.abi
			if (abiObj !== '' && abiObj !== null && abiObj !== undefined) {
				try {
					abiObj = JSON.parse(abiObj)
				} catch (err) {
					abiObj = null
					this.$message.error('ABI有误！')
				}
			}
			const data = {}
			// 判断网络是否正确
			let thisChainId = this.convertChainId(this.clickItem.network)
			let that = this
			// 执行网络切换，并返回切换状态
			if (thisChainId != this.chainId) {
				await this.$confirm(
					'当前钱包连接的链与本合约连接的链不同。将为你切换到对应网络' +
						this.clickItem.network +
						'?',
					'当前网络错误',
					{
						confirmButtonText: '确定切换',
						cancelButtonText: '取消',
					}
				)
					.then(async () => {
						thisChainId = '0x' + thisChainId.toString(16)
						that.switchNetwork(thisChainId, [abiObj, Item])
					})
					.catch(() => {
						this.$message.error(
							'连接请求错误，请尝试手动连接。连接后刷新页面重试。'
						)
						return
					})
			} else {
				this.callFunctions(abiObj, Item)
			}
		},

		//查看JSONABI
		checkJSONABI() {
			this.ABIVisible = true
			this.checkABI = this.clickItem.abi
		},

		//查看人类可读ABI
		checkHumanReadableABI() {
			const iface = new ethers.utils.Interface(this.clickItem.abi)
			const FormatTypes = ethers.utils.FormatTypes
			let checkABI = iface.format(FormatTypes.full)
			this.checkABI = '['
			for (let i in checkABI) {
				if (i < checkABI.length - 1) {
					this.checkABI += '"' + checkABI[i] + '",' + '\n\n'
					continue
				}
				this.checkABI += '"' + checkABI[i] + '"]'
			}
		},

		//函数运行
		async callFunctions(abiObj, Item) {
			// 连接MetaMask
			await this.connectMetaMask()
			// 通过abi调用函数
			if (abiObj != null) {
				try {
					// 期望调用的abi函数对象
					let ItemAbiObj = []
					// 遍历abi对象，根据点击的函数名，拿到期望调用的abi函数对象
					for (let i = 0; i < abiObj.length; i++) {
						if (abiObj[i].name === Item.name) {
							ItemAbiObj.push(abiObj[i])
						}
					}
					let contract = new ethers.Contract(
						this.clickItem.address,
						abiObj,
						this.signer
					)
					let args = []
					for (let i = 0; i < Item.inputs.length; i++) {
						args.push(Item.inputs[i].value)
					}
					// 调用函数
					args = await this.arrayParsing.stringArrayParsing(args)
					let overrides = {
						value: '',
					}
					overrides.value = this.overrides.value.toString()
					let cardContent = ''
					if (
						this.overrides.value != '' &&
						ItemAbiObj[0].stateMutability == 'payable'
					) {
						if (this.unit == 'Gwei') {
							overrides.value = (
								overrides.value * 1000000000
							).toString()
						}
						if (this.unit == 'Ether') {
							overrides.value = (
								overrides.value * 1000000000000000000
							).toString()
						}
						cardContent = await contract[Item.name](
							...args,
							overrides
						)
					} else {
						cardContent = await contract[Item.name](...args)
					}
					// 接收返回的数据
					let cardContentData = ''
					// 根据不同的 stateMutability 类型处理 返回的结果
					if (Item.stateMutability == 'view') {
						cardContentData = cardContent.toString()
					} else {
						cardContentData = cardContent
					}
					let typeFlag = ''
					if (
						Item.stateMutability == 'payable' ||
						Item.stateMutability == 'nonpayable'
					) {
						typeFlag = 'write'
					} else {
						typeFlag = 'read'
					}
					// eslint-disable-next-line no-underscore-dangle
					const cardData = {
						function: Item.name,
						content: cardContentData,
						typeFlag: typeFlag,
					}
					this.abiCardData.unshift(cardData)
				} catch (err) {
					const cardData = {
						function: Item.name,
						content: JSON.parse(JSON.stringify(err)),
						typeFlag: 'error',
					}
					this.abiCardData.unshift(cardData)
				}
			}
		},

		//匹配网络
		matchingNetwork(value, type) {
			if (type == 'chainID') {
				for (let i in this.network) {
					if (value == this.network[i].chainID) {
						return this.network[i]
					}
				}
			}
		},

		//切换网络
		async switchNetwork(chainId, runParameter) {
			try {
				await ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: chainId }],
				})
				//这里继续执行函数
				this.callFunctions(runParameter[0], runParameter[1])
			} catch (switchError) {
				if (switchError.code === 4902) {
					let chainID = chainId.slice(2)
					let network = this.matchingNetwork(chainID, 'chainID')
					chainID = parseInt(chainID)
					chainID = '0x' + chainID.toString(16)
					try {
						await ethereum.request({
							method: 'wallet_addEthereumChain',
							params: [
								{
									chainId: chainID,
									chainName: network.networkName,
									rpcUrls: [network.rpcUrls],
								},
							],
						})
					} catch (addError) {
						this.$message.error(
							'连接请求错误，请尝试手动连接。连接后刷新页面重试。'
						)
					}
				} else {
					this.$message.error(
						'连接请求错误，请尝试手动连接。连接后刷新页面重试。'
					)
				}
			}
		},

		// 根据选择的网络返回对应的chainId
		convertChainId(network) {
			for (let i in this.network) {
				if (network == this.network[i].networkName) {
					return this.network[i].chainID
				}
			}
		},

		//清空输出
		clearOutput() {
			this.abiCardData = []
		},

		//调用复制的方法
		copy(text, output, class1) {
			const clipboard = new Clipboard(class1, {
				text: () => {
					return text
				},
			})
			clipboard.on('success', () => {
				this.$message.success(output)
				clipboard.destroy()
			})
			clipboard.on('error', () => {
				this.$message.error('复制失败')
				clipboard.destroy()
			})
		},
	},
}
</script>

<style scoped>
.abi {
	width: 100%;
	height: auto;
}

.scroll {
	width: 100%;
	height: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.container {
	max-width: 95%;
	padding: 32px;
	height: min-content;
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

.container .title {
	font-size: 18px;
	font-weight: 700;
	margin-bottom: 24px;
}

.container .tips {
	font-size: 14px;
	color: #000;
	font-weight: 700;
	align-self: flex-start;
	margin-bottom: 10px;
}

.container .buttons {
	display: flex;
	align-self: flex-start;
	gap: 20px;
	margin-bottom: 30px;
}

.rightInput span {
	margin-bottom: 15px;
	display: inline-block;
}

/deep/ .rightInput input {
	width: 100%;
	min-width: 250px;
}

.container .btn {
	height: 36px;
	cursor: pointer;
	font-size: 14px;
	font-weight: 700;
	border-radius: 6px;
	display: flex;
	padding: 0 15px;
	line-height: 36px;
	justify-content: center;
	margin: 20px auto;
}

.container .contract-list {
	width: 100%;
}

input::-webkit-input-placeholder {
	color: #c4c7cd;
}

.clearfix:before,
.clearfix:after {
	display: table;
	content: '';
}

.clearfix:after {
	clear: both;
}

.box-card {
	margin-top: 40px;
	width: 100%;
}

.sol-body {
	display: flex;
}

.sol-body-left {
	width: 231px;
	height: 90px;
	margin-top: 10px;
	margin-right: 30px;
}

.sol-body-left .el-aside {
	width: 231px !important;
}

.el-container .el-aside {
	overflow-x: hidden;
}

.sol-body-left li {
	display: inline-table;
	width: 100%;
}

/deep/ .el-submenu__title span {
	margin-left: -2px;
}

.sol-body-left .abi-input {
	border: 1px solid #dcdfe6;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	color: #606266;
	display: inline-block;
	font-size: inherit;
	height: 40px;
	line-height: 40px;
	outline: 0;
	padding: 0 15px;
	-webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
	transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
	width: 100%;
}

.rightInput {
	margin: 20px 0;
}

.leftTitle {
	font-size: 13px;
	width: 114px;
	display: inline-block;
	overflow: scroll;
}

.shop {
	height: 40px;
}

.shop ul {
	float: right;
	height: 100%;
}

.shop ul li {
	height: 40px;
	line-height: 40px;
	border-radius: 9px;
	margin-left: 12px;
	background-color: rgb(204, 204, 204);
	transition: all 0.5s;
	-webkit-transition: all 0.5s;
	max-width: 40px;
	display: inline-block;
	vertical-align: top;
}

.shop ul .view:hover {
	color: #fff;
	background-color: #409eff;
}

.shop ul .share:hover {
	color: #fff;
	background-color: #409eff;
}

.shop ul .paperclip:hover {
	color: #fff;
	background-color: #409eff;
}

.shop ul .edit:hover {
	color: #fff;
	background-color: #e6a23c;
}

.shop ul .delete:hover {
	color: #fff;
	background-color: #f56c6c;
}

.shop ul li:hover {
	max-width: 250px;
}

.shop ul li i {
	padding: 0 9px 0 12px;
	margin: 0;
}

.shop ul li span {
	font-size: 14px;
	height: 40px;
	width: auto;
	padding-right: 10px;
	display: inline-block;
	opacity: 0;
}

.shop ul li:hover span {
	opacity: 100;
}

.leftTitle::-webkit-scrollbar {
	width: 0px;
}

.rightInput span:nth-child(2) {
	width: 80%;
	margin-left: 10px;
}

/deep/ .rightInput .el-select {
	width: 80px;
}

.el-submenu {
	padding-top: -10px;
}

.el-icon-star-on {
	margin-top: -16px;
}

.popUpBox ul li {
	display: inline-block;
	width: 115px;
	height: 100px;
	margin-right: 10px;
	border: #dcdfe6 solid 1px;
	border-radius: 10%;
	max-width: 220px;
	min-width: 100px;
}

/deep/ .el-dialog {
	max-width: 834px;
	min-width: 650px;
}

.popUpBox ul li:hover {
	color: #409eff;
}

.popUpBox ul li .el-icon {
	height: 50px;
	width: 100%;
	font-size: 200%;
	text-align: center;
	line-height: 60px;
}

.popUpBox ul li span {
	display: inline-block;
	width: 100%;
	text-align: center;
	line-height: 23px;
}

.upload-demo {
	cursor: pointer;
}

.upload-demo,
/deep/ .el-upload {
	width: 100%;
}

/deep/ .el-submenu__icon-arrow {
	right: 10px;
}

/deep/ .el-submenu__title {
	padding-left: 5px !important;
}

.rightList {
	width: 100%;
}

.rightList .title {
	margin-bottom: 0px;
	margin-top: 10px;
	color: #909399;
	width: 90px;
	display: inline-block;
}

/deep/ .contentList .el-submenu__icon-arrow {
	color: red;
	display: none;
}

.el-main div .submenu {
	float: right;
	margin-left: 20px;
	padding: 12px 10px;
	width: auto;
	height: 38px;
}

.submenu span span {
	display: inline-block;
	margin-left: 15px;
	display: none;
}

.submenu span span /deep/ .el-icon--left {
	margin: 0px;
}

.rightList .el-button {
	float: right;
	margin-right: 10px;
	margin-top: 10px;
}

.sol-body-right {
	width: 100%;
}

.contentRight {
	width: 100%;
}

.dialog-div {
	width: 100%;
	color: #409eff;
	padding-left: 12%;
	float: right;
}

.contentRight .rightButton {
	margin-top: 20px;
	margin-bottom: 20px;
	float: right;
}

.box-card-error {
	background-color: rgb(255, 42, 42);
}

.innerFrame {
	color: #000000;
	font-size: 18px;
}

.innerFrame .inner-title {
	margin: 10px 0;
}

.innerFrame ul li {
	width: auto;
	min-width: 123px;
	height: 95px;
	padding: 10px;
	border: #dcdfec solid 1px;
	display: inline-block;
	margin-right: 3px;
	border-radius: 20px;
	font-size: 14px;
	text-align: center;
	vertical-align: top;
	line-height: 65px;
}

/deep/ .el-dialog__body {
	padding: 10px 20px 20px 27px;
}

.visible {
	width: 100%;
	text-align: center;
	margin-bottom: 20px;
}

.contract-list .main {
	height: 800px;
	border: 1px solid #eee;
}

.contract-list .main .sidebar {
	background-color: rgb(238, 241, 246);
}

.sol-body-left .column {
	height: 600px;
	border-color: rgb(235 238 245);
	border-style: 'dashed';
}

.contentList .contentList-text {
	margin-left: 9px;
}

.sol-body-right pre {
	white-space: normal;
	word-break: break-all;
}

.link {
	cursor: pointer;
}

.el-textarea__inner {
	min-height: 33px;
}
</style>
