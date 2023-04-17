<template>
	<div class="abi">
		<Navigation></Navigation>
		<div class="scroll">
			<div class="container">
				<div class="title">{{$t("abi.title")}} </div>
				<div class="usingHelp"><span>
						<a href="https://github.com/ChainToolDao/chaintool-frontend/wiki/ABI%E5%8F%AF%E8%A7%86%E5%8C%96%E8%B0%83%E7%94%A8" target="_blank">{{$t("pubilc.usingHelp")}}
							<img src="../assets/imgs/explain.png" alt="">
						</a>
					</span>
				</div>
				<!-- 移动端 -->
				<div class="contract-list">
					<div class="mobileContract" v-if="Object.keys(clickItem).length!=0">
						<div>
							<el-button size="mini" @click="clickItem=[],styleHeight('init')">{{$t('abi.btnReturn')}}</el-button>
							<el-button size="mini" @click="actionBar=!actionBar,styleHeight(500)" v-if="!actionBar">{{$t('abi.btnDevelop')}}</el-button>
							<el-button size="mini" @click="actionBar=!actionBar,styleHeight(500)" v-if="actionBar">{{$t('abi.btnFold')}}</el-button>
						</div>
						<el-collapse-transition>
							<div class="actionBar" v-if="actionBar">
								<ul>
									<div effect="dark" placement="bottom">
										<li @click="shareContract(clickItem)">
											<i class="el-icon-share"></i>
											<span>{{$t('abi.btnShare')}}</span>
										</li>
									</div>
									<div effect="dark" placement="bottom">
										<li @click="checkJSONABI">
											<i class="el-icon-view"></i>
											<span>{{$t('abi.btnABI')}}</span>
										</li>
									</div>
									<div effect="dark" placement="bottom">
										<li @click="checkEtherscan">
											<img src="../assets/imgs/etherscanLogo.svg" alt="" class="etherscanLogo">
											<span>{{$t('abi.btnEtherscan')}}</span>
										</li>
									</div>
									<div effect="dark" placement="bottom">
										<li @click="updateContract">
											<i class="el-icon-edit"></i>
											<span>{{$t('abi.btnEdit')}}</span>
										</li>
									</div>
									<div effect="dark" placement="bottom">
										<li @click="deleteContract">
											<i class="el-icon-delete"></i>
											<span>{{$t('abi.btnDelect')}}</span>
										</li>
									</div>
								</ul>
							</div>
						</el-collapse-transition>
						<div class="contractInfo">
							<div><span>{{ $t('abi.contractName') }}:</span>{{clickItem.name}}</div>
							<div><span>{{ $t('abi.blockchainAddress') }}:</span>{{clickItem.network}}</div>
							<div><span>{{ $t('abi.contractAddress') }}:</span>{{ clickItem.address }}</div>
						</div>
						<div class="mobileMainBox">
							<div v-for="item in tableData[0].ItemAbi" :key="item.name">
								<div class="noValue" v-if="item.inputs && item.inputs.length==0 && item.stateMutability=='Read'">
									<el-tag>{{ item.stateMutability }}</el-tag>
									<span>{{ item.name }} </span>
									<div><span>{{$t('abi.returnContent')}}</span><span v-if="item.return"><json-viewer :value="item.return.content"></json-viewer>
										</span><span v-if="!item.return"><img src="../assets/imgs/load.gif" alt="">{{item.return}}
										</span></div>
									<div></div>
								</div>
							</div>
						</div>
					</div>
					<!-- PC端 -->
					<el-container class="main">
						<el-aside class="sidebar">
							<el-menu>
								<el-button class="btn" type="primary" @click="addContract()">{{$t("abi.btnAddContract")}}</el-button>
								<div v-if="localData != null">
									<div v-for="item in contractList" :key="item.network">
										<el-submenu :index=item.network>
											<template slot="title">
												<i class="el-icon-star-on"></i>
												<span class="leftTitle">{{ item.network }}</span>
											</template>
											<el-menu-item v-for="data, key in item.data" :key=key @click="openItem(data, item.network)">{{ data.name }}</el-menu-item>
										</el-submenu>
									</div>
								</div>
							</el-menu>
						</el-aside>
						<el-container>
							<el-main>
								<div v-if="this.clickItem.length != 0" class="shop" ref="shop">
									<ul>
										<el-tooltip effect="dark" :content="$t('abi.sharePrompt')" placement="bottom">
											<li @click="shareContract(clickItem)" class="view">
												<i class="el-icon-share"></i>
												<span>{{$t('abi.btnShare')}}</span>
											</li>
										</el-tooltip>
										<el-tooltip effect="dark" :content="$t('abi.ABIPrompt')" placement="bottom">
											<li @click="checkJSONABI" class="view">
												<i class="el-icon-view"></i>
												<span>{{$t('abi.btnABI')}}</span>
											</li>
										</el-tooltip>
										<el-tooltip effect="dark" :content="$t('abi.EtherscanPrompt')" placement="bottom">
											<li @click="checkEtherscan" class="paperclip">
												<img src="../assets/imgs/etherscanLogo.svg" alt="" class="etherscanLogo">
												<span>{{$t('abi.btnEtherscan')}}</span>
											</li>
										</el-tooltip>
										<el-tooltip effect="dark" :content="$t('abi.editPrompt')" placement="bottom">
											<li @click="updateContract" class="edit">
												<i class="el-icon-edit"></i>
												<span>{{$t('abi.btnEdit')}}</span>
											</li>
										</el-tooltip>
										<el-tooltip effect="dark" :content="$t('abi.delectPrompt')" placement="bottom">
											<li @click="deleteContract" class="delete">
												<i class="el-icon-delete"></i>
												<span>{{$t('abi.btnDelect')}}</span>
											</li>
										</el-tooltip>
									</ul>
								</div>
								<el-table :data="tableData">
									<el-table-column prop="ItemName" :label="$t('abi.contractName')"> </el-table-column>
									<el-table-column prop="ItemNetwork" :label="$t('abi.blockchainAddress')"> </el-table-column>
									<el-table-column prop="ItemAddress" :label="$t('abi.contractAddress')"> </el-table-column>
								</el-table>
								<div class="sol-body">
									<div class="sol-body-left">
										<el-aside width="400px" class="column">
											<el-menu :data="tableData">
												<div v-if="tableData.length>=1">
													<template v-for="(item, index) in tableData[0].ItemAbi">
														<div @click="transferParameters(item,index)" class="contentList" :key=index>
															<el-submenu v-if="item.type == 'function' || item.type == 'view'" :key="index" :index="index + ''">
																<template slot="title">
																	<el-tag v-if="item.stateMutability == 'Read'"> Read
																	</el-tag>
																	<el-tag v-if="item.stateMutability == 'Write'" type="warning"> Write </el-tag>
																	<el-tag v-if="item.stateMutability == 'Payable'" type="danger"> Payable </el-tag>
																	<el-tag v-if="!item.stateMutability" type="warning">
																		{{ item.stateMutability }} </el-tag>
																	<span class="contentList-text">{{ item.name }}</span>
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
												<div class="title">{{$t('abi.callFunctions')}} </div>
												<div class="title">{{ parameter[0].name }} </div>
												<el-table :data="parameter[0].inputs" class="list" v-if="parameter[0].inputs.length > 0">
													<el-table-column label="Type">
														<template slot-scope="scope">
															<span>{{ scope.row.type }}</span>
														</template>
													</el-table-column>
													<el-table-column label="Name">
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
															<el-input :placeholder="$t('abi.inputValue')" v-model="overrides.value" class="input-with-select">
																<el-select v-model="unit" slot="prepend" :placeholder="$t('abi.pleaseChoose')">
																	<el-option label="Wei" value="Wei"></el-option>
																	<el-option label="Gwei" value="Gwei"></el-option>
																	<el-option label="Ether" value="Ether"></el-option>
																</el-select>
															</el-input>
														</span>
													</div>
												</div>
												<div class="rightButton">
													<el-button type="danger" @click="clearOutput">{{ $t('abi.clearOutput') }}</el-button>
													<el-button type="primary" @click="submitAbiForm(parameter[0])" :loading="isRun">{{ $t('abi.run') }}</el-button>
												</div>
											</div>
										</div>
										<div>
											<div class="sol-body-right" :data="abiCardData">
												<div v-if="abiCardData.length != 0">
													<el-card class="box-card" v-for="(item, index) in abiCardData" :key="index" :index="index + 'card'">
														<div slot="header" class="clearfix">
															<div><span v-if="item.typeFlag == 'error'">❌ </span>
																{{ $t('abi.callFunctions') }}{{ item.function }}</div>
														</div>
														<pre>
                                                            <span v-if="item.typeFlag == 'write'">{{ $t('abi.transactionDetails') }}</span>
                                                            <span v-if="item.typeFlag=='read'||item.typeFlag=='error'">{{ $t('abi.returnContent') }}</span>
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
					<el-dialog :title="$t('abi.contract')" :visible.sync="dialogFormVisible" @close='closureInputBox'>
						<el-dialog width="45%" :title="$t('abi.commonABIs')" :visible.sync="innerVisible" append-to-body>
							<div class="innerFrame">
								<div v-for="piece in presetsABI" :key="piece.standard">
									<div class="inner-title">{{ piece.standard }}</div>
									<div>
										<ul>
											<li class="link" v-for="data  in piece.data" @click="getABI(data)" :key="data">{{ data
                                            }}</li>
										</ul>
									</div>
								</div>
							</div>
						</el-dialog>
						<el-form :model="form" :rules="rules" ref="form">
							<el-form-item :label="$t('abi.contractName')" prop="name" :label-width="formLabelWidth" class="formLabelWidth">
								<el-input v-model="form.name" autocomplete="off" :placeholder="$t('abi.validateName')"></el-input>
							</el-form-item>
							<el-form-item :label="$t('abi.blockchainNetwork')" prop="network" :label-width="formLabelWidth" class="formLabelWidth">
								<el-select v-model="form.network" :placeholder="$t('abi.selectNetwork')">
									<el-option v-for="item in network" :key="item.chainID" :label="item.networkName" :value="item.networkName"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item :label="$t('abi.contractAddress')" prop="address" :label-width="formLabelWidth" class="formLabelWidth">
								<el-input v-model="form.address" autocomplete="off" placeholder="address"></el-input>
							</el-form-item>
							<el-form-item label="ABI" prop="abi" :label-width="formLabelWidth" class="el-textarea formLabelWidth">
								<textarea autocomplete="off" v-model="form.abi" rows="5" placeholder='[{"anonymous": false,"inputs": [],"name": "Approval","type": "event"}]' class="el-textarea__inner"></textarea>
							</el-form-item>
							<div class="popUpBox">
								<ul>
									<li class="upload-demo" @click="innerVisible = true">
										<el-button> {{ $t('abi.chooseCommonABI') }}</el-button>
									</li>
									<li class="">
										<el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" accept=".ABI,.txt" :on-success="readFile">
											<el-button>{{$t('abi.uploadABIFile') }}</el-button>
										</el-upload>
									</li>
									<li class="upload-demo">
										<el-button @click="getABIFromEtherscan" :loading="btnChangEnable" :disabled="btnChangEnable">{{$t('abi.etherscanGet')  }}</el-button>
									</li>
								</ul>
							</div>
						</el-form>
						<div slot="footer" class="dialog-footer">
							<el-button @click="cancelDialog">{{$t('pubilc.cancel') }}</el-button>
							<el-button type="primary" @click="onSubmit('form')"> {{$t('pubilc.sure')  }}</el-button>
						</div>
					</el-dialog>
					<el-dialog :title="$t('abi.lookOverABI') " :visible.sync="ABIVisible" width="30%" center>
						<div class="visible">
							<el-button round @click="checkJSONABI"> {{$t('abi.jsonABI')}}</el-button>
							<el-button round @click="checkHumanReadableABI">{{$t('abi.readableABI')}} </el-button>
						</div>
						<el-input type="textarea" class="checkABI" :disabled="true" :autosize="{ minRows: 5, maxRows: 20}" :placeholder="$t('abi.inputPrompt')" v-model="checkABI">
						</el-input>
						<span slot="footer" class="dialog-footer">
							<el-button type="primary" @click="copy(checkABI,'复制成功','.dialog-footer')">{{$t('pubilc.copy')}}</el-button>
							<el-button type="danger" @click="ABIVisible = false">{{$t('abi.quit')}}</el-button>
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
import intefUrl from "../interface";

export default {
	name: 'abi',
	components: {
		Navigation,
	},

	metaInfo() {
		return {
			title: "Chaintool - " + this.title,

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
			if (value === '' || value == undefined) {
				callback(new Error(this.$t('abi.validateName')))
			} else{
				callback()
			}
		}

		// 表单验证 - 项目地址
		let validateAddress = (rule, value, callback) => {
			if (
				value === '' ||
				value == undefined ||
				!ethers.utils.isAddress(value)
			) {
				callback(new Error(this.$t('abi.validateAddress')))
			} else {
				callback()
			}
		}

		// 表单验证 - ABI
		let checkAbi = (rule, value, callback) => {
			if (value === '' || value == undefined) {
				callback(new Error(this.$t('abi.checkAbi')))
			} else {
				callback()
			}
		}

		// 表单验证 - 网络
		let checkNetwork = (rule, value, callback) => {
			if (value === '' || value == undefined) {
				callback(new Error(this.$t('abi.checkNetwork')))
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
			//按钮使用
			btnChangEnable: false,
			//是运行
			isRun: false,
            //操作栏
            actionBar:false,
		}
	},

	async created() {
		//初始化
		this.init()
	},

	async mounted() {
        await this.dbGetABI(this.$route.query.id)
		//判断url是否携带address与currencySymbol
		if (
			!(this.$route.params.currencySymbol !== undefined &&
			this.$route.params.address !== undefined)
		) {
		    this.$route.params.currencySymbol="Sepolia"
			this.$route.params.address="0x23A4aAe678305F8E994da2eCf8Bb33F2306CAdF1"
		}
	    if(this.$route.query.id  == undefined ||this.form.abi== ''){
            //获取所有信息，填充表单
			for (let i = 1; i < this.network.length; i++) {
				if (
					this.network[i].currencySymbol ==
						this.$route.params.currencySymbol ||
					this.network[i].chainID == this.$route.params.currencySymbol
				) {
					this.form.network = this.network[i].networkName
					this.form.address = this.$route.params.address
					// 获取ABI
					this.form.name = await this.getABIFromEtherscan()
					if (this.form.name == '' || this.form.name == undefined) {
						this.$message.error(this.$t('abi.autoAddError'))
						this.form = {
							name: '',
							address: '',
							abi: '',
							network: '',
						}
						return
					}
					this.form.name = this.form.name.substring(
						1,
						this.form.name.length - 1
					)
				}
			}
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
            if(this.form.abi!= ''){
                // 风险提示
                if(this.$route.query.id !=undefined){
                    this.$message({
                        message: this.$t('abi.riskWarning'),
                        type: 'warning'
                    });
                }
			    this.createABI(this.form.name)
            }
	},

	computed:{
      title(){
	      return this.$t("title.abi")
	    },
  	},

	methods: {
		// 创建合约
		async createABI(name) {
			this.dialogFormVisible = true
			await this.addContract()
			await this.onSubmit('form')
		},

		//传递参数
		transferParameters(item, index) {
			this.parameter = [item, index]
			if (
				this.parameter[0].inputs.length == 0 &&
				item.stateMutability != 'Payable'
			) {
				this.submitAbiForm(this.parameter[0])
			}
		},

		//读取文件
		readFile(response, file, fileList) {
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

        // 数据库获取ABI
        async dbGetABI(id){
            try {
                await axios
                    .get(intefUrl.getABI+"?id="+id)
                    .then(async (res) => { 
                        for(let i in this.network){
                            if(res.data.data.chainId==this.network[i].chainID){
                                res.data.data.chainID=this.network[i].networkName
                                break;
                            }
                        }
                        this.form = {
                            name: res.data.data.name,
                            address: res.data.data.address,
                            abi: res.data.data.abi,
                            network:  res.data.data.chainID
                        }
                    });
            } catch (error) {
            }
        },

        //提交ABI
        async submitABI (Item){
            let id
            try { 
                await axios
                    .post(intefUrl.submitABI, {
                        name: Item.name,
                        chainId: Item.network,
                        address: Item.address,
                        abi:Item.abi,
                    })
                    .then((res) => {
                        id= res.data.data.id
                     });
            } catch (error) {
                id= "error"
            }
            return id 
        },

		//分享合约
		async shareContract(Item) {
			let url
            // 获取abi
			let abi = await this.getNameAndABI(Item.network, Item.address)
            let id=""
			if (!abi) {
                //网络名称转ChainID
                let chainID =  await this.networkConvertChainID([Item])
                // 添加到数据库中
                id= await this.submitABI(Item,chainID[0].network)
                if (id=="error"){
				    this.$message.error(this.$t('abi.promptSharingError'))
				    return
                }
			}
			for (let i in this.network) {
				if (this.network[i].networkName == Item.network || this.network[i].chainID == Item.network) {
					url =
						'https://chaintool.tech/abi/' +
						this.network[i].currencySymbol +
						'/' +
						Item.address
                    if (id !=""){
                       url =url +"?id="+id
                    }
					this.copy(url, this.$t('abi.copyShareSuccess'), '.shop')
					this.$refs.shop.click()
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
			this.innerVisible = false
		},

		//获取名字和ABI
		async getNameAndABI(network, address) {
			//请求网络
			let requestNetwork =
				'https://anyabi.xyz/api/get-abi/' +
				this.convertChainId(network) +
				'/' +
				address
			let abi = []
			try {
				await axios.get(requestNetwork).then((res) => {
					abi = [
						JSON.stringify(res.data.name),
						JSON.stringify(res.data.abi),
					]
				})
				return abi
			} catch (error) {
				return false
			}
		},

		//从Etherscan获取ABI
		async getABIFromEtherscan() {
			if (this.form.address == '' || this.form.network == '') {
				this.$message.error(this.$t('abi.examineAddressAndNetwork'))
				return
			}
			this.btnChangEnable = true
			let abi = await this.getNameAndABI(
				this.form.network,
				this.form.address
			)
			this.btnChangEnable = false
			if (abi) {
				this.form.abi = abi[1]
				return abi[0]
			}
			this.$message.error(this.$t('abi.getABIeroor'))
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
		async addContract() {
			this.addCurrentNetwork()
			this.isUpdate = false
			this.dialogFormVisible = true
		},

		// 添加当前网络
		async addCurrentNetwork() {
			try {
				//当前钱包网络
				let network = parseInt(
					await window.ethereum.request({
						method: 'eth_chainId',
					})
				)
				for (let i in this.network) {
					if (this.network[i].chainID == network) {
						return
					}
				}
				this.network.push({
					networkName: this.$t('abi.useCurrentNetwork')+ ':chainID=' + network,
				})
			} catch {}
		},

		//去除当前网络
		async removeCurrentNetwork() {
			if (
				this.network[this.network.length - 1].networkName.indexOf(
					this.$t('abi.useCurrentNetwork')
				) != -1
			) {
				this.network.pop()
			}
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
			this.removeCurrentNetwork()
			this.$refs['form'].resetFields()
			this.dialogFormVisible = false
			// 清空表单
			this.form = {}
		},

		//ChainID转换网络名称
		chainIDConvertNetwork(val) {
			for (let i in val) {
				for (let k in this.network) {
					if (this.network[k].chainID == val[i].network) {
						val[i].network = this.network[k].networkName
					}
				}
			}
			return val
		},

		//网络转换ChainID
		networkConvertChainID(val) {
			for (let i in val) {
				for (let k in this.network) {
					if (this.network[k].networkName == val[i].network) {
						val[i].network = this.network[k].chainID
					}
				}
			}
			return val
		},

		// localstorage的get方法
		get(name) {
			const localData = localStorage.getItem(name)
			if (localData == '' || localData == null) return null
			return this.chainIDConvertNetwork(JSON.parse(localData))
		},

		// localstorage的set方法
		set(name, val) {
			val = this.networkConvertChainID(val)
			//将JSON.stringify(val)储存到name
			localStorage.setItem(name, JSON.stringify(val))
		},

		// localstorage的remove方法
		remove(name, target) {
			let localData = this.storage.get(name)
			if (localData.length != 0 || localData != null) {
				for (let i = 0; i < localData.length; i++) {
					if (localData[i].address === target[0] && localData[i].network === target[1]) {
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
			if (this.localData == null) {
				// 清空localData
				this.localData = []
			}

			// 校验规则
			this.$refs[formName].validate(async (valid) => {
				if (valid) {
					if (await this.validABI(this.form.abi)) {
						if (
							this.form.network.indexOf(this.$t('abi.useCurrentNetwork')) != -1
						) {
							this.form.network = this.form.network.substring(
								9,
								this.form.network.length
							)
						}
						if (this.form.abi[1].indexOf('{') == -1) {
							const iface = new ethers.utils.Interface(
								eval(this.form.abi)
							)
							const FormatTypes = ethers.utils.FormatTypes
							this.form.abi = iface.format(FormatTypes.json)
						}
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
						this.$message.error(this.$t('abi.checkAbiError'))
						return false
					}
					return abiObj
				} catch (err) {
					this.$message.error(this.$t('abi.checkAbiError'))
					return false
				}
			}
		},

		// 单击左侧导航栏的事件
		openItem(Item, network) {
            this.styleHeight()
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
            this.runReadFunction()
		},

        //运行读函数
        runReadFunction(){
            if(document.body.clientWidth>768){
                return
            }
            for (let i in this.tableData[0].ItemAbi){
                if(this.tableData[0].ItemAbi[i].inputs && this.tableData[0].ItemAbi[i].inputs.length==0 && this.tableData[0].ItemAbi[i].stateMutability=='Read'){
                    this.submitAbiForm(this.tableData[0].ItemAbi[i])
                }
            }
        },

		//更新合约
		updateContract() {
			if (this.clickItem.length == 0) {
				this.$message(this.$t('abi.notSelectedContractPrompt'))
				return
			}
			this.isUpdate = true
			// 清空 abiCardData
			this.abiCardData = []
			//清空 parameter
			this.parameter = null
			this.chooseContractName = this.clickItem.name
			this.form = {
				name: this.clickItem.name,
				address: this.clickItem.address,
				abi: this.clickItem.abi,
				network: this.clickItem.network,
			}
			this.addCurrentNetwork()
			//打开编辑窗口
			this.dialogFormVisible = true
		},

		//查看Etherscan
		checkEtherscan() {
			if (this.clickItem.length == 0) {
				this.$message(this.$t('abi.notSelectedContractPrompt'))
				return
			}
			if (this.clickItem.network.indexOf('chainID') != -1) {
				this.$message(this.$t('abi.contractNotRecorded'))
				return
			}
			for (let i in this.network) {
				if (this.clickItem.network == this.network[i].networkName) {
					if (this.network[i].chainExplorer == '') {
						this.$message(this.$t('abi.contractNotRecorded'))
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
				this.$message(this.$t('abi.notSelectedContractPrompt'))
				return
			}
			// 清空 abiCardData
			this.abiCardData = []
			//清空 parameter
			this.parameter = null
			if (this.clickItem.name !== undefined) {
				// 删除合约	
				this.storage.remove('localData', [this.clickItem.address,this.clickItem.network])
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
					this.$message.error(this.$t('abi.deniedAccess'), error)
				}
			} else {
				this.$message.error(this.$t('abi.notInstalledMetaMaskPrompt'))
			}
		},

		// ABI 函数 表单 提交事件
		async submitAbiForm(Item) {
			if (
				Item.stateMutability == 'Read' &&
				(await this.matchRpcUrl(this.clickItem.network))
			) {
				//调用读函数的运行方法
				this.readFunctionRun(Item)
				return
			}
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
					this.$message.error(this.$t('abi.abiError'))
				}
			}
			const data = {}
			// 判断网络是否正确
			let thisChainId = this.convertChainId(this.clickItem.network)
			let that = this
			if (this.clickItem.network.indexOf('chainID') != -1) {
				thisChainId = this.clickItem.network.substring(
					8,
					this.clickItem.network.length
				)
			}
			// 执行网络切换，并返回切换状态
			if (thisChainId != this.chainId) {
				await this.$confirm(
					this.$t('abi.switchNetworkPrompt') +
						this.clickItem.network +
						'?',
					this.$t('abi.currentNetworkError'),
					{
						confirmButtonText: 	this.$t('pubilc.sure'),
						cancelButtonText: this.$t('pubilc.cancel'),
					}
				)
					.then(async () => {
						if (this.clickItem.network.indexOf('chainID') != -1) {
							thisChainId = this.clickItem.network.substring(
								8,
								this.clickItem.network.length
							)
						}
						thisChainId = Number(thisChainId)
						thisChainId = '0x' + thisChainId.toString(16)
						that.switchNetwork(thisChainId, [abiObj, Item])
					})
					.catch(() => {
						this.$message.error(
								this.$t('abi.connectionRequestError')
						)
						return
					})
			} else {
				this.callFunctions(abiObj, Item)
			}
		},

		//匹配RpcUrl
		matchRpcUrl(network) {
			if (network != 'Hardhat(localhost)') {
				for (let i in this.network) {
					if (network == this.network[i].networkName) {
						return this.network[i].rpcUrls[1]
					}
				}
			}
			return false
		},

		//读函数运行
		async readFunctionRun(Item) {
			let rpcUrl = await this.matchRpcUrl(this.clickItem.network)
			this.signer = new ethers.providers.JsonRpcProvider(rpcUrl)
			this.callFunctions(this.clickItem.abi, Item)
		},

		//查看JSONABI
		checkJSONABI() {
			this.ABIVisible = true
			this.checkABI = this.clickItem.abi
		},

		//查看可读ABI
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
			this.isRun = true
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
                    // 判断宽度是否为移动端设备
                    if(document.body.clientWidth<=768){
                        //判断为移动端设备
                        for(let i  in this.tableData[0].ItemAbi){
                            if(this.tableData[0].ItemAbi[i].name==Item.name){
                                this.tableData[0].ItemAbi[i].return=cardData
                                // 防止数据不刷新
                                this.tableData[0].ItemAbi[i].name=this.tableData[0].ItemAbi[i].name+" "
                            }
                        }
                    }else{
                        //判断为pc端设备
                        this.abiCardData.unshift(cardData)
                    }
                    this.styleHeight(10)
				} catch (err) {
					const cardData = {
						function: Item.name,
						content: JSON.parse(JSON.stringify(err)),
						typeFlag: 'error',
					}
					this.abiCardData.unshift(cardData)
				}
			}
			this.isRun = false
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
									rpcUrls: [network.rpcUrls[0]],
								},
							],
						})
					} catch (addError) {
						this.$message.error(
							this.$t('abi.connectionRequestError')
						)
					}
				} else {
					this.$message.error(
						this.$t('abi.connectionRequestError')
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

        //样式高度变化
         styleHeight(value){
            if(value=="init"){
                 document.querySelector('.main').style.height="800px"
                 return
            }
            if (document.body.clientWidth<=768){
                setTimeout(()=>{
                    try{
                        document.querySelector('.main').style.height = document.querySelector('.mobileContract').offsetHeight+"px"
                    }catch(error){}
                },value)
            }
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
	min-height: 94%;
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

/deep/ .el-input--suffix .el-input__inner {
	width: 300px;
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
	background-color: rgb(180, 180, 180);
	transition: all 0.5s;
	-webkit-transition: all 0.5s;
	max-width: 40px;
	display: inline-block;
	vertical-align: top;
	cursor: pointer;
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
	opacity: 0;
}

.shop ul li:hover span {
	opacity: 100;
}

.etherscanLogo {
	width: 16px;
	height: 16px;
	padding: 0 9px 0 12px;
	margin: 0 0 -2px 0;
	filter: invert(100%);
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

.popUpBox ul {
	margin-left: 100px;
}

.popUpBox ul li {
	display: inline-block;
	width: auto;
	margin-right: 8px;
	max-width: 220px;
	min-width: 100px;
}

/deep/ .popUpBox ul li .upload-demo .el-upload-list {
	display: none;
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

.title {
	font-size: 18px;
	font-weight: 700;
    margin-top: 15px;
	margin-bottom: 15px;
	position:relative;
    display: inline-block;
}

.usingHelp {
	width: 100%;
	height: 21px;
	margin-bottom: 15px;
}

.usingHelp span{
	float: right;
}

.usingHelp span a{
	text-decoration:none;
	cursor:pointer;
	font-size: 15px;
	color: #909399;
	width: 90px;
	display: inline-block;
}

.usingHelp span a:hover{
	color: #409eff;
}

.usingHelp span img{
	margin-bottom: -3px;
	width: 15px;
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

/deep/ .el-dialog__body .checkABI textarea {
	color: black;
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

.contract-list .main .el-aside{
        width: 184px !important;
}

/deep/ .el-dialog {
	max-width: 834px;
	min-width: 650px;
}

.mobileContract{
    display: none;
}

@media (max-width:768px){
    .contract-list{
        position: relative;
    }

    .contract-list .main .el-container{
        display: none;
    }

    .contract-list .main .el-aside{
        width: 101% !important; 
    }

    /deep/ .el-dialog{
        max-width: none;
        min-width: auto ;
        width: 94%;
    }

    /deep/ .el-form-item__label{
        font-size: 13px;
        padding-right: 5px;
        display: inline-block;
    }

    /deep/ .el-dialog__body{
        padding: 0px 15px ;
    }

    /deep/ .el-form {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
    }

    /deep/ .formLabelWidth label{
        width: 70px !important;
        text-align: right;
    }

    /deep/ .el-form-item{
        width: 100%;
    }

    /deep/ .formLabelWidth div{
        margin-left: 0px !important;
        display: inline-block;
        width: calc(100% - 70px);
    }

    /deep/ .formLabelWidth div div{
        margin-left: 0px !important;
        display: inline-block;
        width: 100%;
    }

    /deep/ .el-input--suffix .el-input__inner{
        width: 100%;
    }
    
    /deep/ .el-form-item{
        margin-bottom: 18px;
        vertical-align:top;
    }

    /deep/ .popUpBox ul{
        margin-left: 0px;
    }

    /deep/ .popUpBox ul li{
        margin-top: 5px;
    }

    /deep/ .el-dialog{
        margin-top: 10vh !important;
        width: 96% !important;
    }

    .innerFrame ul li{
        height: auto;
        margin-bottom: 10px;
    }

    .mobileContract{
        z-index:999;
        position: absolute;
        display: inline-block;
        background-color: rgb(255, 255, 255);
        width: 101%;
        min-height: 800px;
    }

    .mobileContract >div:nth-child(1){
        display: flex;
    }

    .contractInfo{
        border: 1px solid rgb(230, 230, 230) ;
        padding: 5px;
        margin: 10px 0;
        border-radius: 5px;
    }

    .contractInfo div{
        margin: 5px 0;
        word-break: break-all;
    }

    .contractInfo div span{
        color: #909399;
    }

    .actionBar{
        margin: 10px 0;
        border-radius: 7px;
    }

    .etherscanLogo{
        padding: 0;
    }

    .actionBar ul div li span {
        margin-left: 10px;
    }

    /deep/  .actionBar ul div li{
        border: 1px solid #d1d0d0;
        margin: 10px;
        padding: 8px;
        border-radius: 7px;
    }

    .noValue  .el-tag{
        margin-right: 10px;
    }

    .noValue > div {
        margin: 10px 0;
        color: #c4c7cd;
    }

    /deep/ .noValue > div span div  .jv-code{
        padding: 8px 11px;
    }

    .noValue div span:nth-child(1){
        float: left;
        margin-top: 3px;
    }

    /deep/ .noValue div span:nth-child(2){
        display: inline-block;
    }

    /deep/ .noValue div span:nth-child(2) img{
        filter: invert(100%);
        width: 22px;
        height: 22px;
        margin-left: 80px;
    }
    .contractInfo div span{
        margin-right: 10px;
    }
}
</style>