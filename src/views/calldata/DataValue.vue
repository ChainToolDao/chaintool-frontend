<template>
	<div>
		<div v-if='Array.isArray(data.value)'>
			<span v-if="Array.isArray(data.value[0])">[(
				<span v-for="i, index in data.value[0]">
					<span v-if="judgeJump(data.value[0][index])">
						<span @click="jumpLink(data.value[0][index])" class="list-number">{{
                            data.value[0][index]
                        }} <sub>10</sub></span>
						<span>({{ conversionHex(data.value[0][index]) }})<sub>16</sub></span>
						<span v-if="index + 1 != data.value[0].length">, </span>
					</span>
					<span v-else>
						{{ i }}
						<span v-if="index + 1 != data.value[0].length"> , </span>
					</span>
				</span>
				<span>)]</span>
			</span>
			<span v-else>
				<span v-if='!Array.isArray(data.argument)'>
					<span v-if="data.argument.indexOf('[]') != -1">
						<span>[</span>
					</span>
				</span>
				<span v-for="i, index in data.value">
					<span v-if="judgeJump(data.value[index])">
						<span @click="jumpLink(data.value[index])" class="list-number">{{ data.value[index]}}</span>
						<sub class="list-number">10</sub>
						<span>({{ conversionHex(data.value[index]) }}<sub>16</sub>)<span v-if="index + 1 != data.value.length">,
								<br></span></span>
					</span>
					<span v-else>
						{{ i }}
						<span v-if="index + 1 != data.value.length"> , <br></span>
					</span>
				</span>
				<span v-if='!Array.isArray(data.argument)'>
					<span v-if="data.argument.indexOf('[]') != -1">]</span>
				</span>
			</span>
		</div>
		<span v-else> {{ data.value }}</span>
	</div>
</template>

<script>
export default {
	props: {
		data: '',
	},
	methods: {
		// 跳转链接-单位转换
		jumpLink(data) {
			let routeUrl = '/unitConvert/' + data
			window.open(routeUrl, '_blank')
		},

		//对表格大于10000的int和uint类型进行处理
		conversionHex(decimal) {
			let hex
			if (decimal._hex) {
				hex = decimal._hex.toString(16)
			} else {
				hex = '0x' + parseInt(decimal).toString(16)
			}
			return hex
		},

		//检查int和uint值是否大于10000
		checkValue(intValue) {
			let numericValue
			if (intValue._hex) {
				numericValue = intValue._hex
			} else {
				numericValue = parseInt(intValue)
			}
			if (numericValue > 10000) {
				return true
			}
			return false
		},

		//判断值是否符合跳转条件
		judgeJump(value) {
			if (
				value.toString().indexOf('0x') == -1 &&
				this.checkValue(value)
			) {
				return true
			}
			return false
		},
	},
}
</script>

<style scoped>
.list-number {
	color: #409eff;
}
</style>