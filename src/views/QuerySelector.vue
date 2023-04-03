<template>
  <div class="ABIView">
    <Navigation></Navigation>
    <div class="ABI">
      <div class="container">
        <h3 class="title">函数名查询函数选择器(4字节)<span><a href="https://github.com/ChainToolDao/chaintool-frontend/wiki/%E5%87%BD%E6%95%B0%E5%90%8D%E6%9F%A5%E8%AF%A2%E5%87%BD%E6%95%B0%E9%80%89%E6%8B%A9%E5%99%A8(4%E5%AD%97%E8%8A%82)"  target="_blank">使用帮助 <img src="../assets/imgs/explain.png" alt=""></a></span> </h3>
        <div>
          <h5>通过函数名查询4字节函数选择器</h5>
          <div>
            <el-input v-model="enterFunctionName" placeholder="Enter The Function Signature"></el-input>
            <el-button @click="queryFunctionSelector">查询</el-button>
          </div>
        </div>
        <h5 class="result">
          {{ outputSelector
          }}<img class="copyButton" v-if="canCopyABI" src="../assets/imgs/copy.png" @click="copy(outputSelector)" />
        </h5>
        <div>
          <h5>通过字节函数选择器函数名查询函数签名</h5>
          <div>
            <el-input v-model="enterSelector" placeholder="Input Selector"></el-input>
            <el-button @click="querySignature()">查询</el-button>
          </div>
        </div>
        <h5 class="result">
          {{ signature }}
          <img src="../assets/imgs/copy.png" alt="" v-if="canCopyFunctionSignature" class="copyButton" @click="copy(signature)" />
          <img class="load" src="../assets/imgs/load.gif" alt="" v-if="load" />
        </h5>
      </div>
    </div>
  </div>
</template>
<script>
import Navigation from "../components/Navigation.vue";
import Clipboard from "clipboard";
import { ethers } from "ethers";

export default {
  name: "querySelector",
  components: {
    Navigation,
  },
  metaInfo() {
    return {
      title: "Chaintool - 函数名查询函数选择器(4字节)",
      meta: [
        {
          name: "keyword",
          content: "函数选择器(4字节)查询及反查",
        },
      ],
    };
  },
  data() {
    return {
      // 输入ABI
      enterFunctionName: "transfer(address,uint256)",
      // 输出ABI
      outputSelector: "",
      // 输入选择器
      enterSelector: "0x0dbe671f",
      // 签名
      signature: "",
      // 可以复制ABI
      canCopyABI: false,
      // 可以复制函数签名   
      canCopyFunctionSignature: false,
      // 加载
      load: false,
    };
  },
  
  methods: {
    //格式函数签名
    formatFunctionSignature(signature) {
      if (signature.indexOf("function ") == 0) {
        signature = signature.slice(8).replace(/^\s*/g, "");
      }
      return signature   
    },

    //查询函数选择器
    async queryFunctionSelector() {
      let ABI = [];
      ABI[0] = this.$options.methods.formatFunctionSignature(this.enterFunctionName);
      if (ABI[0]) {
        ABI[0] = "function " + ABI[0];
      } else {
        this.outputSelector =
          "你输入的函数有误，请重新输入!  请用如下格式输入，例：transfer(address,uint256)";
        return;
      }
      try {
        let iface = new ethers.utils.Interface(ABI);
        ABI[0] = ABI[0].slice(9);
        this.outputSelector = iface.getSighash(ABI[0]);
        this.canCopyABI = true;
        this.functionSelector.submitFunctionSelector(ABI[0],this.outputSelector)
      } catch (error) {
        this.canCopyABI = false;
        this.outputSelector = "你输入的函数有误，请重新输入";
      }
    },

    //查询函数签名
    async querySignature() {
      let enterSelector = this.enterSelector;
      if (enterSelector.indexOf("0x") != 0) {
        enterSelector = "0x" + enterSelector;
      }
      this.signature = "正在查询";
      this.load = true;
      this.canCopyFunctionSignature = false;
      let signature = []
      signature= await this.functionSelector.getFunctionSignature(enterSelector)
      if (signature.length >= 1) {
        this.signature = signature.join(";");
        this.canCopyFunctionSignature = true;
        this.load = false;
      } else {
        this.signature = "你所查找的选择器暂未被记录，例：0x0dbe671f";
        this.load = false;
      }
    },

    copy(text) {
      const clipboard = new Clipboard(".result", {
        text: () => {
          return text;
        },
      });
      clipboard.on("success", () => {
        this.$message.success("复制成功");
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        this.$message.error("复制失败");
        clipboard.destroy();
      });
    },
  },
};
</script>

<style scoped>
.ABIView {
  width: 100%;
  height: 94%;
}

.ABI {
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
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.container div {
  width: 100%;
}

.container div div {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.container div div .el-input {
  width: 100%;
  margin-right: 0px;
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

/deep/ .container div .el-input input {
  padding: 0 15px !important;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 0px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  border: none;
  background-color: #f5f5f5;
  border-radius: 6px;
  width: 95%;
  margin-right: 20px;
}

.container .el-button {
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
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}

.container h3 {
  font-size: 18px;
  font-weight: 700;
}

.container h5 {
  margin: 10px 0;
  font-size: 14px;
  color: #000;
  font-weight: 700;
}

.container .result {
  width: 100%;
  margin-left: 10px;
  word-wrap: break-word;
}

.copyButton {
  width: 15px;
  height: 15px;
  margin-left: 10px;
}

.load {
  width: 30px;
  height: 30px;
  filter: invert(100%);
  vertical-align: middle;
}
</style>
