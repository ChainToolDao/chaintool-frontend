<template>
	<div>
		<div class="mainRow">{{$t("calldata.inputFunction")}}</div>
		<el-input class="funInput" v-model="codingSelector" :placeholder="$t('calldata.inputFunction')"></el-input>
		<div class="mainRow">{{$t("calldata.parameter")}}</div>
		<el-input v-model="codingParameter" :placeholder="$t('calldata.inputParameterPrompt')" type="textarea"></el-input>
		<h5 class="result"> {{ encodingResult }}<img class="copyButton" v-if="canCopy" src="../../assets/imgs/copy.png" @click="copy(encodingResult)" /> </h5>
		<div class="bottomButton" @click="coding()">{{$t("calldata.coding")}}</div>
	</div>
</template>

<script>
import { ethers } from 'ethers'
import Clipboard from 'clipboard'
export default {
	data() {
		return {
			// 编码函数
			codingSelector: 'transferFrom(address,address,uint256)',
			// 编码参数
			codingParameter:
				'0x8ba1f109551bD432803012645Ac136ddd64DBA72\n0xaB7C8803962c0f2F5BBBe3FA8bf41cd82AA1923C\n1000000000000000000',
			// 编码结果
			encodingResult: '',
			// 可以复制
			canCopy: false,
		}
	},

	methods: {
		//编码
		async coding() {
			//清空上次编码的数据
			this.encodingResult = ''
			try {
				let processingParameters = this.codingParameter.split('\n')
				processingParameters =
					await this.arrayParsing.stringArrayParsing(
						processingParameters
					)
				this.canCopy = false
				let codingSelector = this.codingSelector.replace(/^\s*/g, '')
				if (codingSelector.indexOf('function ') != 0) {
					codingSelector = 'function ' + codingSelector
				}
				const iface = new ethers.utils.Interface([codingSelector])
				codingSelector = codingSelector.slice(8).replace(/^\s*/g, '')
				this.encodingResult = iface.encodeFunctionData(
					codingSelector,
					processingParameters
				)
				//把通过编码的数据加入数据库
				this.functionSelector.submitFunctionSelector(
					codingSelector,
					this.encodingResult.substring(0, 10)
				)
				this.canCopy = true
			} catch (error) {
				this.encodingResult = this.$t('calldata.inputError')
			}
		},

		//调用复制的方法
		copy(text) {
			const clipboard = new Clipboard('.result', {
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
.mainRow {
	margin: 11px 0;
}
/deep/ .el-textarea {
	margin-bottom: 20px;
}
.bottomButton {
	margin: 15px 40%;
}
.result {
	width: 100% !important;
	word-break: break-all;
}
</style>