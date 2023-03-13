<template>
    <div class="abi">
        <Navigation></Navigation>
        <div class="scroll">
            <div class="container">
                <div class="title">ABI 图形化</div>
                <div class="buttons">
                    <el-button class="btn" type="primary" @click="dialogFormVisible = true">添加合约</el-button>
                    <el-button class="btn" type="danger" @click="deleteContract">删除当前合约</el-button>
                </div>
                <div class="contract-list">
                    <el-container style="height: 800px; border: 1px solid #eee">
                        <el-aside width="184px" style="background-color: rgb(238, 241, 246)">
                            <el-menu>
                                <div v-if="localData != null">
                                    <el-submenu index="1" v-if="HardhatData.length != 0">
                                        <template slot="title"><i class="el-icon-star-on"></i><span
                                                class="leftTitle">Hardhat(localhost)</span></template>
                                        <el-menu-item v-for="(item, index) in HardhatData" :key="index"
                                            @click="openItem(item)">{{
                                                item.name
                                            }}</el-menu-item>
                                    </el-submenu>
                                    <el-submenu index="2" v-if="GoerliData.length != 0">
                                        <template slot="title"><i class="el-icon-star-on"></i><span
                                                class="leftTitle">Goerli</span></template>
                                        <el-menu-item v-for="(item, index) in GoerliData" :key="index"
                                            @click="openItem(item)">{{
                                                item.name
                                            }}</el-menu-item>
                                    </el-submenu>
                                    <el-submenu index="3" v-if="EthereumMainnetData.length != 0">
                                        <template slot="title"><i class="el-icon-star-on"></i><span
                                                class="leftTitle">Ethereum
                                                Mainnet</span></template>
                                        <el-menu-item v-for="(item, index) in EthereumMainnetData" :key="index"
                                            @click="openItem(item)">{{
                                                item.name
                                            }}</el-menu-item>
                                    </el-submenu>
                                    <el-submenu index="4" v-if="BinanceSmartChainMainnetData.length != 0">
                                        <template slot="title"><i class="el-icon-star-on"></i><span
                                                class="leftTitle">Binance Smart Chain Mainnet</span></template>
                                        <el-menu-item v-for="(item, index) in BinanceSmartChainMainnetData" :key="index"
                                            @click="openItem(item)">{{
                                                item.name
                                            }}</el-menu-item>
                                    </el-submenu>
                                    <el-submenu index="5" v-if="PolygonMainnetData.length != 0">
                                        <template slot="title"><i class="el-icon-star-on"></i><span
                                                class="leftTitle">Polygon Mainnet</span></template>
                                        <el-menu-item v-for="(item, index) in PolygonMainnetData" :key="index"
                                            @click="openItem(item)">{{
                                                item.name
                                            }}</el-menu-item>
                                    </el-submenu>
                                    <el-submenu index="6" v-if="MumbaiData.length != 0">
                                        <template slot="title"><i class="el-icon-star-on"></i><span
                                                class="leftTitle">Mumbai</span></template>
                                        <el-menu-item v-for="(item, index) in MumbaiData" :key="index"
                                            @click="openItem(item)">{{
                                                item.name
                                            }}</el-menu-item>
                                    </el-submenu>
                                    <el-submenu index="7" v-if="SepoliaData.length != 0">
                                        <template slot="title"><i class="el-icon-star-on"></i><span
                                                class="leftTitle">Sepolia</span></template>
                                        <el-menu-item v-for="(item, index) in SepoliaData" :key="index"
                                            @click="openItem(item)">{{
                                                item.name
                                            }}</el-menu-item>
                                    </el-submenu>
                                    <el-submenu index="8" v-if="BinanceSmartChainTestnetData.length != 0" class="leftList">
                                        <template slot="title"><i class="el-icon-star-on"></i><span
                                                class="leftTitle">Binance Smart Chain Testnet</span></template>
                                        <el-menu-item v-for="(item, index) in BinanceSmartChainTestnetData" :key="index"
                                            @click="openItem(item)">{{
                                                item.name
                                            }}</el-menu-item>
                                    </el-submenu>
                                </div>
                            </el-menu>
                        </el-aside>
                        <el-container>
                            <el-main>
                                <el-table :data="tableData">
                                    <el-table-column prop="ItemName" label="合约名称"> </el-table-column>
                                    <el-table-column prop="ItemNetwork" label="区块链网络"> </el-table-column>
                                    <el-table-column prop="ItemAddress" label="合约地址"> </el-table-column>
                                </el-table>
                                <div class="sol-body">
                                    <div class="sol-body-left">
                                        <el-aside width="400px"
                                            style="height: 600px; border-color: rgb(235 238 245); border-style: dashed">
                                            <el-menu :data="tableData">
                                                <div v-if="tableData[0].ItemAbi != null">
                                                    <template v-for="(item, index) in tableData[0].ItemAbi">
                                                        <div @click="parameters(item, index)" class="contentList">
                                                            <el-submenu
                                                                v-if="item.type == 'function' || item.type == 'view'"
                                                                :key="index" :index="index + ''">
                                                                <template slot="title">
                                                                    <el-tag v-if="item.stateMutability == 'view'"> Read
                                                                    </el-tag>
                                                                    <el-tag v-if="item.stateMutability == 'pure'"
                                                                        type="success"> Read </el-tag>
                                                                    <el-tag v-if="item.stateMutability == 'constant'"
                                                                        type="info"> Read </el-tag>
                                                                    <el-tag v-if="item.stateMutability == 'payable'"
                                                                        type="warning"> Write </el-tag>
                                                                    <el-tag v-if="item.stateMutability == 'nonpayable'"
                                                                        type="warning"> Write </el-tag>
                                                                    <el-tag v-if="!item.stateMutability" type="warning">
                                                                        {{ item.stateMutability }} </el-tag>
                                                                    <span style="margin-left: 9px">{{ item.name }}</span>
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
                                                <div class="title">参数</div>
                                                <el-table :data="parameter[0].inputs" class="list">
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
                                            </div>
                                        </div>
                                        <el-button type="primary" class=""
                                            @click="submitAbiForm(parameter[0], parameter[1])">运行</el-button>
                                        <el-button type="danger">清空输出</el-button>
                                        <div>
                                            <div class="sol-body-right" :data="abiCardData">
                                                <div v-if="abiCardData.length != 0">
                                                    <el-card class="box-card" v-for="(item, index) in abiCardData"
                                                        :key="index" :index="index + 'card'">
                                                        <div slot="header" class="clearfix">
                                                            <div>调用函数：{{ item.function }}</div>
                                                        </div>
                                                        <pre
                                                            style="white-space: normal; word-break: break-all">返回内容：{{ item.content }}</pre>
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
                        <el-form :model="form" :rules="rules" ref="form">
                            <el-form-item label="项目名称" prop="name" :label-width="formLabelWidth">
                                <el-input v-model="form.name" autocomplete="off" placeholder="unique name"></el-input>
                            </el-form-item>
                            <el-form-item label="网络" prop="network" :label-width="formLabelWidth">
                                <el-select v-model="form.network" placeholder="请选择要连接的网络">
                                    <el-option label="Hardhat(localhost)" value="Hardhat(localhost)"></el-option>
                                    <el-option label="Ethereum Mainnet" value="Ethereum Mainnet"></el-option>
                                    <el-option label="Goerli" value="Goerli"></el-option>
                                    <el-option label="Binance Smart Chain Mainnet"
                                        value="Binance Smart Chain Mainnet"></el-option>
                                    <el-option label="Polygon Mainnet" value="Polygon Mainnet"></el-option>
                                    <el-option label="Mumbai" value="Mumbai"></el-option>
                                    <el-option label="Sepolia" value="Sepolia"></el-option>
                                    <el-option label="Binance Smart Chain Testnet"
                                        value="Binance Smart Chain Testnet"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="项目地址" prop="address" :label-width="formLabelWidth">
                                <el-input v-model="form.address" autocomplete="off" placeholder="address"></el-input>
                            </el-form-item>
                            <el-form-item label="ABI" prop="abi" :label-width="formLabelWidth" class="el-textarea">
                                <textarea autocomplete="off" v-model="form.abi" rows="5" v-if="hasABI"
                                    placeholder='[{"anonymous": false,"inputs": [],"name": "Approval","type": "event"}]'
                                    class="el-textarea__inner" style="min-height: 33px"></textarea>
                                <div class="popUpBox" v-if="!hasABI">
                                    <ul>
                                        <li class="">
                                            <el-upload class="upload-demo"
                                                action="https://jsonplaceholder.typicode.com/posts/" accept=".ABI,.txt"
                                                :on-success="readFile"> <i
                                                    class="el-icon-upload2 el-icon"></i><span>上传ABI文件</span>
                                            </el-upload>
                                        </li>
                                        <li class="" @click="hasABI = true"><i
                                                class="el-icon-copy-document  el-icon"></i><span>粘贴ABI文件</span></li>
                                        <li class="" @click="getABIFromEtherscan"><i
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
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ethers } from 'ethers'
import Navigation from '../components/Navigation.vue'
import axios from "axios";

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
                    content: 'ABI 图形化, ABI 可视化调用'
                },
                {
                    name: 'description',
                    content: '根据 ABI 自动生成可调用按钮'
                }
            ]
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
                        if (data[i].name === value) {
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
            // 右侧详情栏的表格信息数据
            item: {
                ItemName: '',
                ItemNetwork: '',
                ItemAddress: '',
                ItemAbi: '',
            },
            // 右侧详情栏的表格信息数据对象
            tableData: [],
            // 右侧详情栏的函数表单数据
            abiForm: {},
            // 右侧详情栏的ABI输入框列表数据
            abiData: [],
            // 右侧详情栏的ABI卡片数据 调用函数 返回内容
            abiCardData: [],
            // 左侧导航栏的Hardhat网络的总数据对象
            HardhatData: [],
            // 左侧导航栏的EthereumMainnet网络总数据对象
            EthereumMainnetData: [],
            // 左侧导航栏的Goerli网络的总数据对象
            GoerliData: [],
            // 左侧导航栏的BinanceSmartChainMainnet网络总数据对象
            BinanceSmartChainMainnetData: [],
            // 左侧导航栏的PolygonMainnet网络的总数据对象
            PolygonMainnetData: [],
            // 左侧导航栏的MumbaiData网络的总数据对象
            MumbaiData: [],
            // 左侧导航栏的Sepolia网络的总数据对象
            SepoliaData: [],
            // 左侧导航栏的BinanceSmartChainTestnet网络的总数据对象
            BinanceSmartChainTestnetData: [],
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
            formLabelWidth: '120px',
            // 监听左侧点击的导航标题
            clickItem: {},
            // 与合约交互相关的数据定义
            accountAddress: '',
            provider: {},
            signer: {},
            chainId: 0,
            // 有ABI
            hasABI: false,
            //参数列表
            parameter: null
        }
    },

    created() {
        this.init()
    },

    methods: {
        //判断abi值是否为空
        determineAbiIsEmpty() {
            if (this.form.abi == "") {
                this.hasABI = false
            }
        },

        //传递参数
        parameters(item, index) {
            this.parameter = [item, index]
        },

        //读取文件
        readFile(response, file, fileList) {
            this.hasABI = true
            let reader = new FileReader();
            reader.readAsText(file.raw, 'UTF-8')//读取，转换字符编码
            let that = this
            reader.onload = function (e) {
                let val = e.target.result;//获取数据
                let rtulist = val.split("\r\n")
                that.form.abi = rtulist
            }
        },

        //从Etherscan获取ABI
        async getABIFromEtherscan() {
            if (this.form.address == "" || this.form.network == "") {
                this.$message.error("请输入项目地址和输入网络后重试");
                return
            }
            //请求网络
            let requestNetwork = null
            switch (this.form.network) {
                case ("Hardhat(localhost)"):
                    this.$message.error("当前网络不支持Etherscan获取");
                    return
                case ("Ethereum Mainnet"):
                    requestNetwork = "https://api.etherscan.io/api?module=contract&action=getabi&address=" + this.form.address + "&apikey=" + process.env.VUE_APP_APIKEY
                    break;
                case ("Goerli"):
                    requestNetwork = "https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=" + this.form.address + "&apikey=" + process.env.VUE_APP_APIKEY
                    break;
                case ("Binance Smart Chain Mainnet"):
                    requestNetwork = "https://api.etherscan.io/api?module=contract&action=getabi&address=" + this.form.address + "&apikey=" + process.env.VUE_APP_APIKEY
                    break;
                case ("Polygon Mainnet"):
                    requestNetwork = "https://api.etherscan.io/api?module=contract&action=getabi&address=" + this.form.address + "&apikey=" + process.env.VUE_APP_APIKEY
                    break;
                case ("Mumbai"):
                    requestNetwork = "https://api.etherscan.io/api?module=contract&action=getabi&address=" + this.form.address + "&apikey=" + process.env.VUE_APP_APIKEY
                    break;
                case ("Sepolia"):
                    requestNetwork = "https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=" + this.form.address + "&apikey=" + process.env.VUE_APP_APIKEY
                    break;
                case ("Binance Smart Chain Testnet"):
                    requestNetwork = "https://api-testnet.bscscan.com/api?module=contract&action=getabi&address=" + this.form.address + "&apikey=" + process.env.VUE_APP_APIKEY
                    break;
            }
            let that = this
            try {
                await axios
                    .get(requestNetwork)
                    .then((res) => {
                        if (res.data.result == "Contract source code not verified") {
                            throw 'abc';
                        }
                        this.hasABI = true
                        that.form.abi = res.data.result
                    });
            } catch (error) {
                this.$message.error("Etherscan获取失败，请检查你输入的地址与网络后重试");
            }
        },

        // 初始化数据
        async init() {
            // 给storage 对象添加方法
            this.storage.get = this.get
            this.storage.set = this.set
            this.storage.remove = this.remove
            // 读取localdata
            this.localData = this.storage.get('localData')
            this.HardhatData = this.solveData('Hardhat(localhost)')
            this.GoerliData = this.solveData('Goerli')
            this.EthereumMainnetData = this.solveData('Ethereum Mainnet')
            this.BinanceSmartChainMainnetData = this.solveData('Binance Smart Chain Mainnet')
            this.PolygonMainnetData = this.solveData('Polygon Mainnet')
            this.MumbaiData = this.solveData('Mumbai')
            this.SepoliaData = this.solveData('Sepolia')
            this.BinanceSmartChainTestnetData = this.solveData('Binance Smart Chain Testnet')
            //修改是否存在ABI的状态
            this.hasABI = false
            this.tableData = Array(1).fill(this.item)
            console.log("初始化数据位置", this.tableData)
            // 清空卡片数据
            this.abiCardData = []
            // 清空当前点击对象
            this.clickItem = []
        },

        closureInputBox() {
            this.hasABI = false;//清空数据
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
        onSubmit(formName) {
            console.log("提交传入参数", formName)
            console.log("this.localData", this.localData)
            if (this.localData == null) {
                // 清空localData
                this.localData = []
            }
            // 校验规则
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    console.log("this.localData", this.localData)
                    console.log("this.form", this.form)
                    if (await this.validABI(this.form.abi)) {
                        this.localData.push(this.form)
                        // 保存localData到localStorage
                        this.storage.set('localData', this.localData)
                        //关闭弹出窗
                        this.dialogFormVisible = false
                        //清空表单
                        this.$refs.form.resetFields()
                        //初始化
                        this.init()
                    }
                } else {
                    return false
                }
            })
        },

        //解析ABI
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

        // 取消按钮 事件
        cancelDialog() {
            // 清空表单
            this.$refs.form.resetFields()
            this.dialogFormVisible = false
        },

        // 单击左侧导航栏的事件
        openItem(Item) {
            console.log("Item", Item)
            // 清空 abiCardData
            this.abiCardData = []
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
            //其他
            let otherMethod = []
            console.log("this.tableData", this.tableData)
            console.log("this.tableData[0].ItemAbi", this.tableData[0].ItemAbi)
            console.log(this.tableData)
            for (let i = 0; i < this.tableData[0].ItemAbi.length; i++) {
                switch (this.tableData[0].ItemAbi[i].stateMutability) {
                    case ("view"):
                        viewMethod.push(this.tableData[0].ItemAbi[i])
                        break;
                    case ("nonpayable"):
                        writeMethod.push(this.tableData[0].ItemAbi[i])
                        break;
                    default:
                        otherMethod.push(this.tableData[0].ItemAbi[i])
                        break;
                }
            }
            this.tableData[0].ItemAbi = []
            this.tableData[0].ItemAbi.push(...viewMethod)
            this.tableData[0].ItemAbi.push(...writeMethod)
            this.tableData[0].ItemAbi.push(...otherMethod)
            this.clickItem = Item
        },

        // 删除合约事件
        deleteContract() {
            console.log("正在执行删除合约", this.clickItem.name)
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
                    this.signer = new ethers.providers.Web3Provider(this.provider).getSigner()
                    this.chainId = parseInt(await window.ethereum.request({ method: 'eth_chainId' }))
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
            console.log("cahinId", thisChainId, this.chainId)
            if (thisChainId != this.chainId) {
                await this.$confirm('当前钱包连接的链与本合约连接的链不同。将为你切换到对应网络' + this.clickItem.network + '?', '当前网络错误', {
                    confirmButtonText: '确定切换',
                    cancelButtonText: '取消',
                }).then(async () => {
                    thisChainId = "0x" + thisChainId.toString(16)
                    that.switchNetwork(thisChainId, [abiObj, Item])
                }).catch(() => {
                    this.$message.error('连接请求错误，请尝试手动连接。连接后刷新页面重试。')
                    return
                });
            } else {
                this.numberRun(abiObj, Item)
            }
        },

        //函数运行
        async numberRun(abiObj, Item) {
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
                    let contract = new ethers.Contract(this.clickItem.address, abiObj, this.signer)
                    let args = []
                    for (let i = 0; i < Item.inputs.length; i++) {
                        args.push(Item.inputs[i].value)

                    }
                    // 调用函数
                    const cardContent = await contract[Item.name](...args)
                    // 接收返回的数据
                    let cardContentData = ''
                    // 根据不同的 stateMutability 类型处理 返回的结果
                    if (Item.stateMutability == 'view') {
                        cardContentData = cardContent.toString()
                    } else {
                        cardContentData = cardContent
                    }
                    // eslint-disable-next-line no-underscore-dangle
                    const cardData = {
                        function: Item.name,
                        content: cardContentData,
                    }
                    this.abiCardData.unshift(cardData)
                } catch (err) {
                    this.$message.error(err)
                }
            }
        },

        //切换网络
        async switchNetwork(chainId, runParameter) {
            try {
                await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: chainId }],
                });
                this.numberRun(runParameter[0], runParameter[1])
                //这里继续执行函数
            } catch (switchError) {
                if (switchError.code === 4902) {
                    this.$message.error('该链尚未添加到 MetaMask')
                } else {
                    this.$message.error('连接请求错误，请尝试手动连接。连接后刷新页面重试。')
                }
            }
        },

        // 根据选择的网络返回对应的chainId
        convertChainId(network) {
            let chainId = 0
            switch (network) {
                case 'Hardhat(localhost)':
                    chainId = 31337
                    break
                case 'Ethereum Mainnet':
                    chainId = 1
                    break
                case 'Goerli':
                    chainId = 5
                    break
                case 'Binance Smart Chain Mainnet':
                    chainId = 56
                    break
                case 'Polygon Mainnet':
                    chainId = 137
                    break
                case 'Mumbai':
                    chainId = 80001
                    break
                case 'Sepolia':
                    chainId = 11155111
                    break
                case 'Binance Smart Chain Testnet':
                    chainId = 97
                    break
                default:
                    chainId = 0
            }
            return chainId
        },
    },
}
</script>

<style scoped>
.abi {
    width: 100%;
    height: 100%;
}

.scroll {
    width: 100%;
    height: calc(100vh - 70px);
    display: flex;
    overflow: auto;
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
    content: "";
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
    width: 231px !important
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

.leftTitle {
    font-size: 13px;
    width: 114px;
    display: inline-block;
    overflow: scroll;
}

.leftTitle::-webkit-scrollbar {
    width: 0px;
}

.el-submenu {
    padding-top: -10px;
}

.el-icon-star-on {
    margin-top: -16px;
}

.popUpBox ul li {
    display: inline-block;
    width: 30%;
    height: 120px;
    margin-right: 10px;
    border: #DCDFE6 solid 1px;
    border-radius: 10%;
    max-width: 220px;
    min-width: 100px;
}

.popUpBox ul li:hover {
    color: #409EFF;
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
    line-height: 60px;
}

.upload-demo,
/deep/ .el-upload {
    width: 100%;
}

/deep/ .el-submenu__icon-arrow {
    right: 10px
}

/deep/ .el-submenu__title {
    padding-left: 5px !important
}

.rightList {
    width: 100%;
}

.rightList .title {
    margin-bottom: 0px;
    margin-top: 10px;
    color: #909399;
    width: 50px;
    display: inline-block
}

.rightList .list {}

/deep/ .contentList .el-submenu__icon-arrow {
    color: red;
    display: none;
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
</style>
