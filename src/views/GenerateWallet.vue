<template>
	<div class="generateWallet">
		<Navigation></Navigation>
		<router-view></router-view>
	</div>
</template>

<script>
import Navigation from '../components/Navigation.vue'
import { ethers } from 'ethers'

export default {
	name: 'generateWallet',
	components: {
		Navigation,
	},
	methods: {
		//判断输入内容(生成数量，高级选项，账户，外部/内部，指数)
		judgmentInputContent(
			walletQuantity,
			advancedOptions,
			account,
			externalorInternal,
			index
		) {
			walletQuantity = parseInt(walletQuantity)
			if (!walletQuantity || walletQuantity < 1) {
				return this.$t('generateWallet.IllegalErrorPrompt')
			}
			if (advancedOptions) {
				if (account == '' || externalorInternal == '' || index == '') {
					return '如需开启高级选项，请确保高级选项内的值不为空'
				}
			}
			return true
		},

		//生成助记词（数量）
		generateMnemonic(mnemonicLength) {
			mnemonicLength = parseInt(mnemonicLength)
			mnemonicLength = ((mnemonicLength - 12) / 3) * 4 + 16
			return ethers.utils.entropyToMnemonic(
				ethers.utils.randomBytes(mnemonicLength)
			)
		},
	},
}
</script>

<style scoped>
.generateWallet {
	width: 100%;
	height: auto;
	min-height: calc(100vh - 243px);
}
</style>