<template>
    <div class="abi">
        <Navigation></Navigation>

        <div class="scroll">
            <div class="container">

                <div class="title">ABI图形化</div>

                <div class="buttons">
                    <el-button class="btn" type="primary" @click="dialogFormVisible = true">添加合约</el-button>
                    <el-button class="btn" type="danger" @click="deleteContract">删除当前合约</el-button>
                </div>

                <div class="contract-list">
                    <el-container style="height: 800px; border: 1px solid #eee">
                        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                            <el-menu>
                                <div v-if="localData != null">
                                    <el-submenu index="1" v-if="HardhatData.length != 0">
                                        <template slot="title"><i class="el-icon-star-on"></i>Hardhat</template>
                                        <el-menu-item v-for="(item, index) in HardhatData" :key="index" @click="openItem(item)">{{
                                            item.name
                                        }}</el-menu-item>
                                    </el-submenu>
                                    <el-submenu index="2" v-if="GoerliData.length != 0">
                                        <template slot="title"><i class="el-icon-star-on"></i>Goerli</template>
                                        <el-menu-item v-for="(item, index) in GoerliData" :key="index" @click="openItem(item)">{{
                                            item.name
                                        }}</el-menu-item>
                                    </el-submenu>
                                    <el-submenu index="3" v-if="ETHData.length != 0">
                                        <template slot="title"><i class="el-icon-star-on"></i>Ethereum Mainnet</template>
                                        <el-menu-item v-for="(item, index) in ETHData" :key="index" @click="openItem(item)">{{
                                            item.name
                                        }}</el-menu-item>
                                    </el-submenu>
                                    <el-submenu index="4" v-if="RopstenData.length != 0">
                                        <template slot="title"><i class="el-icon-star-on"></i>Ropsten</template>
                                        <el-menu-item v-for="(item, index) in RopstenData" :key="index" @click="openItem(item)">{{
                                            item.name
                                        }}</el-menu-item>
                                    </el-submenu>
                                    <el-submenu index="5" v-if="BSCData.length != 0">
                                        <template slot="title"><i class="el-icon-star-on"></i>BSC Mainnet</template>
                                        <el-menu-item v-for="(item, index) in BSCData" :key="index" @click="openItem(item)">{{
                                            item.name
                                        }}</el-menu-item>
                                    </el-submenu>
                                    <el-submenu index="6" v-if="BSCTestData.length != 0">
                                        <template slot="title"><i class="el-icon-star-on"></i>BSC Testnet</template>
                                        <el-menu-item v-for="(item, index) in BSCTestData" :key="index" @click="openItem(item)">{{
                                            item.name
                                        }}</el-menu-item>
                                    </el-submenu>
                                </div>
                            </el-menu>
                        </el-aside>
                        <el-container>
                            <el-main>
                                <el-table :data="tableData">
                                    <el-table-column prop="ItemName" label="项目名称"> </el-table-column>
                                    <el-table-column prop="ItemNetwork" label="链条网络"> </el-table-column>
                                    <el-table-column prop="ItemAddress" label="合约地址"> </el-table-column>
                                </el-table>
                                <div class="sol-body">
                                    <div class="sol-body-left">
                                        <el-aside width="400px" style="height: 600px; border-color: rgb(235 238 245); border-style: dashed">
                                            <el-menu :data="tableData">
                                                <div v-if="tableData[0].ItemAbi != null">
                                                    <template v-for="(item, index) in tableData[0].ItemAbi">
                                                        <el-submenu v-if="item.type == 'function' || item.type == 'view'" :key="index" :index="index + ''">
                                                            <template slot="title">
                                                                <el-tag v-if="item.stateMutability == 'view'"> view </el-tag>
                                                                <el-tag v-if="item.stateMutability == 'pure'" type="success"> pure </el-tag>
                                                                <el-tag v-if="item.stateMutability == 'constant'" type="info"> constant </el-tag>
                                                                <el-tag v-if="item.stateMutability == 'payable'" type="warning"> payable </el-tag>
                                                                <el-tag v-if="item.stateMutability == 'nonpayable'" type="warning"> nonpayable </el-tag>
                                                                <el-tag v-if="!item.stateMutability" type="warning"> {{item.stateMutability}} </el-tag>
                                                                <span style="margin-left: 30px">{{ item.name }}</span>
                                                            </template>
                                                            <el-menu-item>
                                                                <el-form :model="abiForm" :rules="rules" :ref="index + 'form'">
                                                                    <div>
                                                                        <div
                                                                            v-for="(item_input, _index) in item.inputs"
                                                                            :key="_index"
                                                                            :index="_index + 'input'"
                                                                        >
                                                                            <input
                                                                                class="abi-input"
                                                                                autocomplete="off"
                                                                                :name="_index + 'input'"
                                                                                :placeholder="item_input.type"
                                                                            />
                                                                        </div>
                                                                        <div style="text-align: center">
                                                                            <el-button type="primary" @click="submitAbiForm(item, index)"
                                                                                >运行</el-button
                                                                            >
                                                                        </div>
                                                                    </div>
                                                                </el-form>
                                                            </el-menu-item>
                                                        </el-submenu>
                                                    </template>
                                                </div>
                                            </el-menu>
                                        </el-aside>
                                    </div>
                                    <div class="sol-body-right" :data="abiCardData">
                                        <div v-if="abiCardData.length != 0">
                                            <el-card
                                                class="box-card"
                                                v-for="(item, index) in abiCardData"
                                                :key="index"
                                                :index="index + 'card'"
                                            >
                                                <div slot="header" class="clearfix">
                                                    <div>调用函数：{{ item.function }}</div>
                                                </div>
                                                <pre style="white-space: normal; word-break: break-all">返回内容：{{ item.content }}</pre>
                                            </el-card>
                                        </div>
                                    </div>
                                </div>
                            </el-main>
                        </el-container>
                    </el-container>
                </div>
                <div class="dialog">
                    <el-dialog title="添加合约" :visible.sync="dialogFormVisible">
                        <el-form :model="form" :rules="rules" ref="form">
                            <el-form-item label="项目名称" prop="name" :label-width="formLabelWidth">
                                <el-input v-model="form.name" autocomplete="off" placeholder="unique name"></el-input>
                            </el-form-item>
                            <el-form-item label="项目地址" prop="address" :label-width="formLabelWidth">
                                <el-input v-model="form.address" autocomplete="off" placeholder="address"></el-input>
                            </el-form-item>
                            <el-form-item label="ABI" prop="abi" :label-width="formLabelWidth" class="el-textarea">
                                <textarea
                                    autocomplete="off"
                                    v-model="form.abi"
                                    rows="5"
                                    placeholder='[{"anonymous": false,"inputs": [],"name": "Approval","type": "event"}]'
                                    class="el-textarea__inner"
                                    style="min-height: 33px"
                                >
                                </textarea>
                            </el-form-item>
                            <el-form-item label="网络" prop="network" :label-width="formLabelWidth">
                                <el-select v-model="form.network" placeholder="请选择要连接的网络">
                                    <el-option label="Hardhat(localhost)" value="hardhat"></el-option>
                                    <el-option label="Ethereum Mainnet" value="eth"></el-option>
                                    <el-option label="Ropsten" value="ropsten"></el-option>
                                    <el-option label="Goerli" value="goerli"></el-option>
                                    <el-option label="BSC Mainnet" value="bsc"></el-option>
                                    <el-option label="BSC Testnet" value="bsctest"></el-option>
                                </el-select>
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

export default {
    name: 'abi',
    components: {
        Navigation,
    },
    metaInfo() {
        return {
            title: 'Chaintool - ABI图形化',

            meta: [
                {
                    name: 'keyword',
                    content: 'abi图形化,abi可视化调用'
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
                console.log(1)
                callback(new Error('请输入ABI'))
            } else {
                callback()
            }
        }
        // 表单验证 - 网络
        let checkNetwork = (rule, value, callback) => {
            if (value === '') {
                console.log(1)
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
            // 左侧导航栏的hardhat网络的总数据对象
            HardhatData: [],
            // 左侧导航栏的goerli网络总数据对象
            GoerliData: [],
            // 左侧导航栏的其他网络总数据对象
            ETHData: [],
            RopstenData: [],
            BSCData: [],
            BSCTestData: [],
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
        }
    },
    created() {
        this.init()
    },
    methods: {
        // 初始化数据
        async init() {
            // 给storage 对象添加方法
            this.storage.get = this.get
            this.storage.set = this.set
            this.storage.remove = this.remove
            // 读取localdata
            this.localData = this.storage.get('localData')
            this.HardhatData = this.solveData('hardhat')
            this.GoerliData = this.solveData('goerli')
            this.ETHData = this.solveData('eth')
            this.RopstenData = this.solveData('ropsten')
            this.BSCData = this.solveData('bsc')
            this.BSCTestData = this.solveData('bsctest')
            this.tableData = Array(1).fill(this.item)
            // 清空卡片数据
            this.abiCardData = []
            // 清空当前点击对象
            this.clickItem = []
            // 连接MetaMask
            if (window.ethereum) {
                console.log(window.ethereum)
                try {
                    this.accounts = await window.ethereum.enable()
                    // console.log("accounts:" + this.accounts);
                    this.accountAddress = this.accounts[0]
                    this.provider = window.ethereum
                    this.signer = new ethers.providers.Web3Provider(this.provider).getSigner()
                    // eslint-disable-next-line radix
                    this.chainId = parseInt(await window.ethereum.request({ method: 'eth_chainId' }))
                    console.log('this.provider', this.provider)
                    console.log('this.signer', this.signer)
                    console.log('this.chainId', this.chainId)
                } catch (error) {
                    this.$message.error('User denied account access', error)
                }
            } else {
                this.$message.error('Need install MetaMask')
            }
        },
        // localstorage的get方法
        get(name) {
            const localData = localStorage.getItem(name)
            if (localData == '' || localData == null) return null
            return JSON.parse(localData)
        },
        // localstorage的set方法
        set(name, val) {
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
            // 清空localData
            if (this.localData == null) {
                this.localData = []
            }
            // 校验规则
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log('submit!')
                    this.localData.push(this.form)
                    // 保存localData到localStorage
                    this.storage.set('localData', this.localData)
                    this.dialogFormVisible = false
                    this.$refs.form.resetFields()
                    this.init()
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 取消按钮 事件
        cancelDialog() {
            // 清空表单
            this.$refs.form.resetFields()
            this.dialogFormVisible = false
        },
        // 单击左侧导航栏的事件
        openItem(Item) {
            // 清空 abiCardData
            this.abiCardData = []
            // 将abi的数值转成对象
            let abiObj = Item.abi
            if (abiObj !== '' && abiObj !== null && abiObj !== undefined) {
                // console.log(JSON.parse(abObj))
                try {
                    abiObj = JSON.parse(abiObj)
                    if (typeof abiObj !== 'object') {
                        abiObj = null
                    }
                } catch (err) {
                    abiObj = null
                    this.$message.error('ABI有误！解析失败！')
                }
            }
            this.tableData = [
                {
                    ItemName: Item.name,
                    ItemNetwork: Item.network,
                    ItemAddress: Item.address,
                    ItemAbi: abiObj,
                },
            ]
            this.clickItem = Item
        },
        // 删除合约事件
        deleteContract() {
            if (this.clickItem.name !== undefined) {
                // 删除合约
                this.storage.remove('localData', this.clickItem.name)
                // 重新载入数据
                this.init()
            }
        },
        // ABI 函数 表单 提交事件
        async submitAbiForm(Item, index) {
            // Item是当前运行框 合约函数的对象 包含了函数名 函数类型 以及有多少个输入框等
            // 将abi的数值转成对象
            let abiObj = this.clickItem.abi
            if (abiObj !== '' && abiObj !== null && abiObj !== undefined) {
                // console.log(JSON.parse(abObj))
                try {
                    abiObj = JSON.parse(abiObj)
                } catch (err) {
                    abiObj = null
                    this.$message.error('ABI有误！')
                }
            }
            const formData = new FormData(this.$refs[index + 'form'][0].$el)
            const data = {}
            // formData.entries()返回一个 iterator对象 ，此对象可以遍历访问FormData中的键值对
            // eslint-disable-next-line no-restricted-syntax
            for (let [key, val] of formData.entries()) {
                Object.assign(data, { [key]: val })
            }
            // 判断网络是否正确
            let thisChainId = this.convertChainId(this.clickItem.network)
            if (thisChainId == this.chainId) {
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
                        // eslint-disable-next-line no-restricted-syntax
                        for (let [key, val] of formData.entries()) {
                            Object.assign(data, { [key]: val })
                            args.push(val)
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
                        console.log(cardContentData)
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
            } else {
                this.$message.error('当前请求的网络与MetaMask选择的网络不一致，请选择正确的网络连接后刷新页面！')
            }
        },
        // 根据选择的网络返回对应的chainId
        convertChainId(network) {
            let chainId = 0
            switch (network) {
                case 'hardhat':
                    chainId = 31337
                    break
                case 'goerli':
                    chainId = 5
                    break
                case 'eth':
                    chainId = 1
                    break
                case 'ropsten':
                    chainId = 3
                    break
                case 'bsc':
                    chainId = 56
                    break
                case 'bsctest':
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
        max-width: 1280px;
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
        box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
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
        gap:20px;
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
    width: 480px;
}
.sol-body {
    display: flex;
}
.sol-body-left {
    width: 600px;
    height: 90px;
    margin-top: 40px;
    margin-right: 50px;
}
.sol-body-left li {
    display: inline-table;
    width: 100%;
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
</style>
