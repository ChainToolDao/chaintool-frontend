<template>
	<div class="traceView" v-loading="loading" element-loading-text="全力分析中...">
        <Navigation></Navigation>

		<div class="scroll">
			<div class="container">
				<div class="title">交易堆栈 Trace 分析工具</div>

				<div class="tips">交易哈希</div>

				<div class="inputBtn">
					<el-input v-model="txid" placeholder="Transaction Hash"></el-input>
					<el-button class="btn" :disabled="loading ? true : false" type="primary" @click="traceVisualization">分析</el-button>
				</div>

				<div class="tips">高级选项</div>

				<el-switch v-model="senior"></el-switch>

				<div v-if="senior" class="senior">
					<div class="tips">Address Map</div>
					<el-input type="textarea" v-model="addressMap" :rows="7" placeholder="请填入Address map"></el-input>

					<div class="tips">Function Map</div>
					<el-input class="functionMap" type="textarea" v-model="functionMap" placeholder="请填入Function map"></el-input>

					<el-link @click="fillDemo">例
						<i class="el-icon-view el-icon--right"></i>
					</el-link>
				</div>

				<div class="tips">Call Traces</div>

				<div class="div-center">
					<div class="tree-container divItem">
						<div class="sender">
							<template v-if="treeData">
								<a :href="'https://etherscan.io/address/' + treeData[0].from" target="_blank">
									<span style="color: rgb(255 0 126)"> [Sender]: </span>
									<span> {{ treeData[0].fromName }}</span>
								</a>
							</template>
						</div>

						<el-tree id="tree" ref="tree" node-key="id" :indent="0" :data="treeData">
							<span class="custom-tree-node" slot-scope="{ data }">
								<template v-if="data.init">
									<!-- 如果该交易为创建合约 -->
									<span class="inline-gas-block"> [{{ data.gasUsed }}] </span>
									<span class="inline-calltype-block"> &emsp;&emsp;{{ data.calltype }} </span>
									<span class="transfer-block" v-show="data.ETH"> &emsp;&emsp;{{ data.ETH }}ETH </span>
									<span class="addressName-block">
										&emsp;&emsp;
										<a :href="'https://etherscan.io/address/' + data.from" target="_blank" @click.stop>
											<span> {{ data.fromName }}</span>
										</a>
										.
									</span>
									<span class="methodName-block"> {{ data.function }} </span>
									<a :href="'https://etherscan.io/address/' + data.output" target="_blank" @click.stop>
										<span class="outline-block" v-show="data.output"> &emsp;=>&emsp;({{ data.output }}) </span>
									</a>
								</template>

								<template v-else>
									<!-- 如果该交易为普通调用 -->
									<span class="inline-gas-block"> [{{ data.gasUsed }}] </span>
									<span class="inline-calltype-block"> &emsp;&emsp;{{ data.calltype }} </span>
									<span class="transfer-block" v-show="data.ETH"> &emsp;&emsp;{{ data.ETH }}ETH </span>
									<span class="addressName-block">
										&emsp;&emsp;
										<a :href="'https://etherscan.io/address/' + data.to" target="_blank" @click.stop>
											<span> {{ data.toName }}</span>
										</a>
										.
									</span>
									<span class="methodName-block"> {{ data.function }} </span>
									<span>(</span>
									<span v-for="(item, index) of data.inputArg" :key="index">
										<template v-if="index == 0">
											<!-- 函数的第一个参数 -->
											&emsp;

											<template v-if="item[1] == null">
												<!-- 如果item[0] == null表示无法解析abi，则直接输出item[2] -->
												<template v-if="item[0] == 'address'">
													<!-- 单个地址参数，带超链接 -->
													<a :href="'https://etherscan.io/address/' + item[3]" target="_blank" @click.stop>
														<span> {{ item[2] }}</span>
													</a>
												</template>

												<template v-else>
													<!-- 其它类型参数，直接显示 -->
													<span>{{ item[2] }}</span>
												</template>
											</template>

											<template v-else>
												<!-- 能解析出abi -->
												<template v-if="item[0] == 'address'">
													<!-- 单个地址参数，带超链接 -->
													<span class="arg-block">{{ item[1] }}</span>
													<span>:&emsp;</span>
													<a :href="'https://etherscan.io/address/' + item[3]" target="_blank" @click.stop>
														<span> {{ item[2] }}</span>
													</a>
												</template>

												<template v-else>
													<!-- 其它类型参数，直接显示 -->
													<span class="arg-block">{{ item[1] }}</span>
													<span>:&emsp;</span>
													<span>{{ item[2] }}</span>
												</template>
											</template>
										</template>

										<template v-else>
											<!-- 函数的第n个参数，n >= 2 -->
											<span>,&emsp;</span>
											<!-- 能解析出abi -->
											<template v-if="item[0] == 'address'">
												<!-- 单个地址参数，带超链接 -->
												<span class="arg-block">{{ item[0] }}</span>
												<span>:&emsp;</span>
												<a :href="'https://etherscan.io/address/' + item[3]" target="_blank" @click.stop>
													<span> {{ item[2] }}</span>
												</a>
											</template>

											<template v-else>
												<!-- 其它类型参数，直接显示 -->
												<span class="arg-block">{{ item[1] }}</span>
												<span>:&emsp;</span>
												<span>{{ item[2] }}</span>
											</template>
										</template>
									</span>
									<span>&emsp;)</span>
									<!-- <span class="midline-block">  &emsp;&emsp;{{ data.functioncall }} </span> -->
									<span class="outline-block" v-show="data.output"> &emsp;=>&emsp;({{ data.output }}) </span>
								</template>
							</span>
						</el-tree>
					</div>
				</div>
			</div>
		</div>
    </div>
</template>

<script>
import axios from 'axios'
import { generateTree } from '../generateTree.js'
import intefUrl from '../interface'
import Navigation from '../components/Navigation.vue'

export default {
    name: 'traceView',
    components: {
        Navigation,
    },
	metaInfo() {
        return {
            title: 'Chaintool - 交易分析工具',

            meta: [
                {
                    name: 'keyword',
                    content: '区块链交易Trace分析'
                },
                {
                    name: 'description',
                    content: '解析 EVM 交易内部详情'
                }
            ]
        }
    },
    data() {
        return {
            loading: false,
            rawTraces: null,
            addressMap: null,
            functionMap: null,
            treeData: null,
            senderLink: '',
            txid: null,
            senior: false,
        }
    },

    methods: {
        fillDemo() {
            let addressStr = `
{
    "0x7a250d5630b4cf539739df2c5dacb4c659f2488d": "Uniswap V2: Router 2",
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": "Wrapped Ether",
    "0x49428f057dd9d20a8e4c6873e98afd8cd7146e3b": "SignataDAO",
    "0x4eeea05c9318d6bd9ddaa5a6a001f1916fbd4c9f": "Uniswap V2: dSATA"
}
`

            let functionStr = `
{
    "0xb6f9de95": "function swapTokens(uint256 amountOutMin,address[] path,address to,uint256 deadline)",
    "0xd0e30db0": "function deposit()",
    "0xa9059cbb": "function transfer(address to,uint256 value) returns (bool )",
    "0x70a08231": "function balanceOf(address ) returns (uint256 )",
    "0x0902f1ac": "function getReserves() returns (uint112 _reserve0,uint112 _reserve1,uint32 _blockTimestampLast)",
    "0x022c0d9f": "function swap(uint256 amount0Out,uint256 amount1Out,address to,bytes data)"
}
`
            this.addressMap = addressStr
            this.functionMap = functionStr
        },

        // -------------------树的可视化-------------------
        async traceVisualization() {
            if (this.txid.length != 66 || this.txid.slice(0, 2) != '0x') {
                this.$message.error('请输入正确的交易hash值')
                return
            }

            this.loading = true

            this.treeData = null

            let resultRawTraces
            let resultAddressMap
            let resultFunctionMap
            let addressMap = this.addressMap
            let functionMap = this.functionMap

            try {
                await axios.post(intefUrl.analyze, { hash: this.txid }).then((res) => {
                    if (res.status == 200) {
                        if (res.data.status !== 0) {
                            this.$message.error(res.data.message)
                        } else {
                            resultRawTraces = JSON.parse(res.data.data.resultRawTraces)

                            resultAddressMap = res.data.data.resultAddressMap
                            resultFunctionMap = res.data.data.resultFunctionMap

                            if (this.senior && this.addressMap) {
                                addressMap = resultAddressMap
                            }

                            if (this.senior && this.addressMap) {
                                functionMap = resultFunctionMap
                            }
                        }
                    } else {
                        this.loading = false
                        this.$message.error('解析失败，请稍后再试')
                    }
                })
            } catch (error) {
                this.loading = false
                this.$message.error('解析失败...')
                console.log(error)
            }

            if (!resultRawTraces) return

            this.treeData = await generateTree(
                resultRawTraces,
                addressMap,
                functionMap, // todo by user
                resultAddressMap,
                resultFunctionMap
            )

            this.loading = false
        },
    },
}
</script>

<style scoped>
	.traceView {
        width: 100%;
        height: 100%;
    }

	.scroll {
		width: 100%;
		height: calc(100vh - 70px);
		display: flex;
		justify-content: center;
		overflow: auto;
	}

    .container {
        max-width: 768px;
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

    .container .el-select,
    .container .el-input,
    .container .el-textarea {
        width: 100%;
        margin-bottom: 15px;
    }

    /deep/ .container .el-select .el-input__inner,
    /deep/ .container .el-input .el-input__inner,
    /deep/ .container .el-textarea .el-textarea__inner {
        border: none;
        background-color: #f5f5f5;
        border-radius: 6px;
    }

    /deep/ .container .el-textarea .el-textarea__inner {
        height: 220px;
    }

	/deep/ .container .functionMap .el-textarea__inner {
        height: 300px;
    }

	.container .btn {
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
    }

	.container .el-switch {
		align-self: flex-start;
		margin-bottom: 20px;
	}

	.container .senior {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.container .inputBtn {
		display: flex;
		width: 100%;
		align-items: center;
		margin-bottom: 30px;
	}

	.container .inputBtn .btn {
		margin-left: 20px;
		flex-shrink: 0;
	}

	.container .inputBtn .el-input {
		margin: 0;
	}

	.container .el-link {
		align-self: flex-start;
		margin-bottom: 20px;
	}

	.el-tree {
		width: 100%;
	}

	.div-center {
		width: 100%;
		box-sizing: border-box;
		border-radius: 5px;
		overflow: auto;
		padding: 20px 0;
	}

	.div-tracebtn {
		margin-top: 5px;
	}

	.sender {
		font-size: 16px;
		padding: 15px 0;
		margin-left: 30px;
		width: 100%;
	}

	.custom-tree-node {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		gap: 15px;
	}

	.inline-gas-block {
		display: inline-block;
		font-style: italic;
		font-size: 16px;
	}

	.inline-calltype-block {
		display: inline-block;
		font-style: italic;
		color: rgb(229 0 238);
		font-size: 16px;
	}

	.transfer-block {
		display: inline-block;
		font-style: italic;
		color: rgb(169 70 70);
		font-size: 16px;
	}
	.methodName-block {
		display: inline-block;
		font-style: italic;
		color: darkorange;
		font-size: 16px;
	}
	.addressName-block {
		display: inline-block;
		font-style: italic;
		font-size: 16px;
	}
	.arg-block {
		display: inline-block;
		font-style: italic;
		color: darkgreen;
		font-size: 16px;
	}
	.midline-block {
		display: inline-block;
		font-style: italic;
		color: rgb(0, 208, 255);
		font-size: 16px;
	}
	.outline-block {
		font-size: 16px;
		float: right;
		font-style: italic;
		color: blue;
	}
	.tree-container /deep/ .el-tree-node__expand-icon.expanded {
		-webkit-transform: rotate(90deg);
		transform: rotate(90deg);
	}

	.tree-container /deep/ .el-icon-caret-right:before {
		content: "\e791";
		font-size: 18px;
	}

	.tree-container /deep/ .el-tree-node__expand-icon {
		margin-left: 15px;
		padding: 0px;
	}

	.tree-container /deep/ .el-tree-node__expand-icon.is-leaf {
		margin-left: 0px;
	}

	.tree-container /deep/ .el-tree-node {
		position: relative;
		padding-left: 16px;
	}

	.tree-container /deep/ .el-tree-node__children {
		padding-left: 16px;
	}

	.tree-container /deep/ .el-tree > .el-tree-node:before {
		border-left: none;
	}

	.tree-container /deep/ .el-tree > .el-tree-node:after {
		border-top: none;
	}
	.tree-container /deep/ .el-tree > .el-tree-node:before {
		border-left: none;
	}

	.tree-container /deep/ .el-tree > .el-tree-node:after {
		border-top: none;
	}

	.tree-container /deep/ .el-tree-node:before {
		content: "";
		left: 10px;
		position: absolute;
		right: auto;
		border-width: 1px;
	}

	.tree-container /deep/ .el-tree-node:after {
		content: "";
		left: 10px;
		position: absolute;
		right: auto;
		border-width: 1px;
	}

	.tree-container /deep/ .el-tree-node:before {
		border-left: 1px solid #e6e6e6;
		bottom: 0px;
		height: 100%;
		top: -19px;
		width: 1px;
	}

	.tree-container /deep/ .el-tree-node:after {
		border-top: 1px solid #e6e6e6;
		height: 25px;
		top: 20px;
		width: 20px;
	}

	.el-tree-node :last-child:before {
		height: 40px;
	}

	.tree-container /deep/ .el-tree .el-tree-node {
		position: relative;
	}

	.tree-container /deep/ .el-tree-node .el-tree-node__content {
		height: auto;
		padding: 15px;
	}

	.tree-container /deep/ .el-tree-node .el-tree-node__content::before {
		border-left: 1px solid #e6e6e6;
		height: 100%;
		top: 0;
		width: 1px;
		margin-left: 1px;
		margin-top: 0px;
		z-index: 8;
	}

	.tree-container /deep/ .el-tree-node .el-tree-node__children .el-tree-node__content::before {
		border-left: 0px solid #e6e6e6;
		height: 100%;
		top: 0;
		width: 1px;
		margin-left: 1px;
		margin-top: 0px;
		z-index: 8;
	}

	.tree-container /deep/ .el-tree-node .el-tree-node__content::after {
		border-top: 1px solid #e6e6e6;
		height: 1px;
		top: 18px;
		width: 13px;
		margin-left: 1px;
		z-index: 8;
	}

	.tree-container /deep/ .el-tree-node .el-tree-node__children .el-tree-node__content::after {
		border-top: 0px solid #e6e6e6;
	}

	.tree-container .el-tree-node .el-tree-node__content::before,
	.tree-container .el-tree-node .el-tree-node__content::after {
		content: "";
		position: absolute;
		right: auto;
	}

	.MapArea {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
	}

	.divItem {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}

	.MapArea > div {
		width: 49%;
	}

	/deep/ .el-textarea__inner {
		height: 200px;
	}
</style>
