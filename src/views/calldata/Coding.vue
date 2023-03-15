<template>
  <div>
    <div class="mainRow">输入函数</div>
    <el-input v-model="codingSelector" placeholder="请输入函数"></el-input>
    <div class="mainRow">参数</div>
    <el-input v-model="codingParameter" placeholder="一行输入一个参数，数组类型参数输入格式:[0x2222,0x4444]" type="textarea"></el-input>
    <h5 class="result"> {{ encodingResult }}<img class="copyButton" v-if="canCopy" src="../../assets/imgs/copy.png"
        @click="copy(encodingResult)" /> </h5>
        <div class="bottomButton" @click="coding()">编码</div>
  </div>
</template>

<script>
import { ethers } from "ethers";
import Clipboard from "clipboard";
export default {
  data() {
    return {
      // 编码函数  
      codingSelector: "transferFrom(address,address,uint256)",
      // 编码参数
      codingParameter: "0x8ba1f109551bD432803012645Ac136ddd64DBA72\n0xaB7C8803962c0f2F5BBBe3FA8bf41cd82AA1923C\n1000000000000000000",
      // 编码结果
      encodingResult: "",
      // 可以复制
      canCopy: false,
    };
  },

  methods: {
    //编码
    coding() {
      //清空上次编码的数据
      this.encodingResult = ""
      try {
        let processingParameters = this.codingParameter.split("\n")
        //对数组类型参数进行处理
        for (let i = 0; i < processingParameters.length; i++) {
          if (processingParameters[i].indexOf('[') == 0 && processingParameters[i].indexOf(']') + 1 == processingParameters[i].length) {
            processingParameters[i] = processingParameters[i].substring(1, processingParameters[i].length - 1).split(',')
          }
        }
        this.canCopy = false
        let codingSelector = this.codingSelector.replace(/^\s*/g, "");
        if (codingSelector.indexOf("function ") != 0) {
          codingSelector = "function " + codingSelector
        }
        const iface = new ethers.utils.Interface([codingSelector,]);
        codingSelector = codingSelector.slice(8).replace(/^\s*/g, "");
        this.encodingResult = iface.encodeFunctionData(codingSelector, processingParameters)
        //把通过编码的数据加入数据库
        this.functionSelector.submitFunctionSelector(codingSelector, (this.encodingResult.substring(0, 10)))
        this.canCopy = true
      } catch (error) {
        this.encodingResult = "你的输入有误，请检查后重试"
      }
    },

    //调用复制的方法
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
.mainRow {
  margin: 11px 0;
}
/deep/ .el-textarea{
  margin-bottom: 20px;
}
.bottomButton{
  margin: 15px 40%;
}
</style>