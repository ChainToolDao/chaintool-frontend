<template>
	<div class="footer">
		<div class="footerNav">
			<div>
				<h3>{{ $t('footer.cooperate') }} </h3>
				<div><a href="https://learnblockchain.cn/" target="_blank">登链社区<img src="../assets/imgs/jump.png" alt=""></a></div>
				<div><a href="https://decert.me/" target="_blank">DeCert.me<img src="../assets/imgs/jump.png" alt=""></a></div>
			</div>
			<div>
				<h3>{{ $t('footer.community') }}</h3>  
				<div><a href="https://discord.com/invite/mf2yvETAVB" target="_blank">Discord<img src="../assets/imgs/jump.png" alt=""></a></div>
				<div><a href="https://twitter.com/UpchainDAO" target="_blank">Twitter<img src="../assets/imgs/jump.png" alt=""></a></div>
			</div>
			<div>
				<h3>More</h3>
				<div><a href="https://learnblockchain.cn/people/14456" target="_blank">Blog<img src="../assets/imgs/jump.png" alt=""></a></div>
				<div><a href="https://github.com/ChainToolDao" target="_blank">Github<img src="../assets/imgs/jump.png" alt=""></a></div>
			</div>
		</div>
		<div class="container">
			<div class="footerMark">© 2023 Chaintool.tech &nbsp;&nbsp;<span v-if="this.$i18n.locale=='zh'">| &nbsp;&nbsp;<a href="https://beian.miit.gov.cn/">粤ICP备17140514号-4</a></span></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Footer',
}
</script>

<style scoped>
.footer {
	width: 100%;
	display: flex;
	justify-content: center;
	flex-direction: column;
	background-color: #fff;
	font-size: 13px;
	cursor: default;
}

.footerMark {
	flex-direction: row;
	width: 100%;
	text-align: center;
}

.container {
	display: flex;
	width: 100%;
	height: 70px;
	box-sizing: border-box;
	justify-content: space-between;
	align-items: center;
	flex-direction: row;
	margin: 0 20px;
}

a {
	text-decoration-line: none;
	color: rgb(161, 161, 161);
}

a:hover {
	cursor: pointer;
	text-decoration: underline;
}

.footerNav {
	display: flex;
	margin: 20px auto 0 auto;
	max-width: 1280px;
	width: 100%;
	justify-content: space-between;
	padding: 0 50px;
}
.footerNav div div {
	margin: 20px 0;
}
.footerNav div div a {
	color: #707070;
}
.footerNav div div a img {
	width: 14px;
	height: 14px;
	margin-left: 5px;
}
.footerNav div h3 {
	font-size: 16px;
}
.footerNav div a {
	font-size: 16px;
}

@media (max-width: 768px) {
	.footerNav {
		display: block;
		text-align: center;
	}
	.footerNav div div {
		display: inline-block;
		width: 50%;
		margin-top: 5px;
	}
}
</style>