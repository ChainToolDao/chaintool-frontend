<template>
  <div class="transactionData">
    <Navigation></Navigation>
    <div class="scroll">
      <div class="container">
        <div class="title">交易输入数据(Calldata)编解码 <span><a href="https://github.com/ChainToolDao/chaintool-frontend/wiki/%E4%BA%A4%E6%98%93%E8%BE%93%E5%85%A5%E6%95%B0%E6%8D%AE(Calldata)%E7%BC%96%E8%A7%A3%E7%A0%81"  target="_blank">使用帮助 <img src="../assets/imgs/explain.png" alt=""></a></span> </div>
        <div class="mainRow">
          <el-menu  :default-active="preferredPage" class="el-menu-demo" mode="horizontal"  @select="cutoverTop">
            <el-menu-item index="deCoding">解码</el-menu-item>
            <el-menu-item index="coding">编码</el-menu-item>
          </el-menu>
        </div>
        <div v-if="selectFunction">
          <DeCoding></DeCoding>
        </div>
        <div v-if="!selectFunction" class="contentSection">
          <Coding></Coding>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from "../components/Navigation.vue";
import Coding from "./calldata/Coding.vue";
import DeCoding from "./calldata/DeCoding.vue";
export default {
  name: "transactionData",
  components: {
    Navigation,
    Coding,
    DeCoding
  },

  metaInfo() {
    return {
      title: "Chaintool - 交易输入数据(Calldata)编解码",
      meta: [
        {
          name: "keyword",
          content: "交易输入数据(Calldata)编码及解码",
        },
      ],
    };
  },

  data() {
    return {
      // 首选页面
      preferredPage: "deCoding",
      // 是解码
      selectFunction: true,
    };
  },

  methods: {
    // 切换编码和解码
    cutoverTop(key) {
      if (key == 'deCoding') {
        this.selectFunction = true
      } else {
        this.selectFunction = false
      }
    },
  },
};
</script>

<style scoped>
.transactionData {
  width: 100%;
  height: 94%;
}

.scroll {
  width: 100%;
  height: calc(93vh - 70px);
  display: flex;
  justify-content: center;
  overflow: auto;
}

/deep/ .result {
  width: 100%;
  margin: 1px 10px;
  width: 680px;
  word-wrap: break-word;
}

.contentSection {
  width: 704px;
}

.container {
  max-width: 768px;
  height: min-content;
  padding: 32px;
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
}

.title span a{
	text-decoration:none;
	cursor:pointer;
	position: absolute;
	font-size: 15px;
	margin-left:5% ;
	margin-bottom: 0px;
	margin-top: 10px;
	color: #909399;
	width: 90px;
	display: inline-block;
}

.title span a:hover{
	color: #409eff;
}

 .title span img{
	margin-bottom: -3px;
	width: 15px;
	display: inline-block;
}

/deep/ .copyButton {
  width: 15px;
  height: 15px;
  margin-left: 10px;
  cursor: pointer;
}

/deep/ .container .mainRow {
  font-size: 14px;
  color: #000;
  font-weight: 700;
  align-self: flex-start;
  margin-bottom: 10px;
}

/deep/ .mainRow {
  margin-bottom: 20px;
}

.el-menu-demo {
  margin-bottom: 10px
}

.el-textarea {
  margin-bottom: 20px;
}

.container .el-input,
.container .el-textarea {
  width: 100%;
  margin-bottom: 30px;
}

.container .el-select {
  width: 100%;
  margin-bottom: 15px;
}

.el-radio {
  margin: 0 10px;
}

.container .el-select,
/deep/ .container .el-input .el-input__inner,
/deep/ .container .el-textarea .el-textarea__inner {
  border: none;
  background-color: #f5f5f5;
  border-radius: 6px;
}

/deep/ .container .el-textarea .el-textarea__inner {
  height: 220px;
}

.container .list {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 6px;
  border-bottom: 1px solid #e8eaec;
  margin-bottom: 30px;
}

.contentButton {
  margin-left: 41%;
}

.container .list .header {
  display: flex;
  width: 100%;
  height: 40px;
  background-color: #f5f5f5;
  justify-content: space-between;
  padding: 0 30px;
  box-sizing: border-box;
  line-height: 40px;
  color: #515a6e;
  font-weight: bold;
  font-size: 14px;
}

.container .list .header>div:last-child {
  width: 30%;
}

.container .list .none {
  display: flex;
  width: 100%;
  height: 40px;
  line-height: 40px;
  justify-content: center;
  color: #515a6e;
  font-size: 14px;
  font-weight: 300;
}

/deep/ .container .bottomButton {
  flex-direction: row;
  display: inline-block;
  text-align: center;
  margin-bottom: 15px;
  width: 96px;
  height: 36px;
  line-height: 35px;
  background-color: #404040;
  cursor: pointer;
  color: #fff;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  border-radius: 6px;
}

/deep/ .container .bottomButton:hover {
  background-color: #575757;
}

/deep/ .container .bottomButton:active {
  background-color: #000;
}

@media (max-width: 808px) {
  .container {
    max-width: calc(100vw - 40px);
  }
}

.manualInput {
  font-size: 1px;
  color: rgb(0, 151, 182);
}

.el-table_cell {
  white-space: pre-wrap;
}

/deep/ .success-row {
  background: #efefef;
}

.analysisResult {
  width: 721px;
  height: auto;
}

.header li {
  display: inline-block;
  border: #EBEEF5 solid 1px;
  line-height: 48px;
  font-size: 15px;
  font-weight: 600;
  color: #909399;
  padding-left: 14px;
}

.header .header-number {
  width: 151px;
  height: 48px;
}

.header .header-parameter {
  margin-left: -1px;
  width: 151px;
  height: 48px;
}

.header .header-value {
  margin-left: -1px;
  width: 421px;
  height: 48px;
}

.analysisResult .noData {
  margin-top: -1px;
  width: 721px;
  height: 48px;
  border: #EBEEF5 solid 1px;
  line-height: 48px;
  text-align: center;
  font-size: 15px;
  color: #909399;
}

.exhibit li {
  border: #EBEEF5 solid 1px;
  display: inline-block;
  color: #909399;
  margin-top: -1px;
  font-size: 14px;
  font-weight: 500;
  color: #979797;
  line-height: 48px;
  padding: 0 10px;
}

.exhibit .exhibit-number {
  width: 151px;
  height: auto;
}

.exhibit .exhibit-parameter {
  margin-left: -1px;
  width: 151px;
  height: auto;
}

.exhibit .exhibit-value {
  margin-left: -1px;
  width: 421px;
  height: auto;
}
</style>