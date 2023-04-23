<template>
  <div class="HashView">
    <Navigation></Navigation>
    <div class="Hash">
      <div class="container">
        <h3 class="title">{{$t("hashTool.title")}} </h3>
        <div class="usingHelp"><span><a href="https://github.com/ChainToolDao/chaintool-frontend/wiki/Hash-%E5%B7%A5%E5%85%B7"  target="_blank">{{$t("pubilc.usingHelp")}} <img src="../assets/imgs/explain.png" alt=""></a></span></div>
        <div>
          <h5>{{$t("hashTool.title")}}</h5>
          <div>
            <el-radio-group v-model="algorithmSelection" @change="clearInputAndOutput">
              <el-radio label="Keccak-256" border size="medium" @change="clearInputAndOutput">Keccak-256</el-radio>
              <el-radio label="Base64" border size="medium" @change="clearInputAndOutput">Base64</el-radio>
            </el-radio-group>
          </div>
          <div v-if="algorithmSelection == 'Base64'">
            <el-radio v-model="isCoding" label="coding" @change="clearInputAndOutput">{{$t("hashTool.coding")}}</el-radio>
            <el-radio v-model="isCoding" label="deCoding" @change="clearInputAndOutput">{{$t("hashTool.decoding")}}</el-radio>
          </div>
          <div>
              <el-select name="" v-model="encodingType" id="">
                <el-option value="Test">Text</el-option>
                <el-option value="Hex">Hex</el-option>
            </el-select>
            <el-input v-model="inputHash" placeholder="Input" type="textarea" autosize></el-input>
            <el-button class="button" @click="getHash">{{$t("hashTool.btnConfirm")}}</el-button>
          </div>
        </div>
        <h5 class="bottom">
          {{ outputHash
          }}<img class="copyButton" v-if="canCopyHash" src="../assets/imgs/copy.png" @click="copy(outputHash)" />
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
  name: "hashTool",
  components: {
    Navigation,
  },
  metaInfo() {
    return {
      title: "Chaintool - " + this.title,
      
      meta: [
        {
          name: "keyword",
          content: "Hash工具：Keccak-256 计算，Base64 编码，Base64 解码",
        },
      ],
    };
  },
  data() {
    return {
      //输入Hash
      inputHash: "123456",
      //输出Hash
      outputHash: "",
      // 可以复制Hash  
      canCopyHash: false,
      // 编码类型  encodingType
      encodingType: "Test",
      // 算法选择
      algorithmSelection: "Keccak-256",
      // 是编码状态
      isCoding: "coding",
    };
  },

  computed:{
      title(){
	      return this.$t("title.hashTool")
	    }
  },

  methods: {
    //清空输入与输出
    clearInputAndOutput: function () {
      this.canCopyHash = false;
      this.inputHash = "";
      this.outputHash = "";
    },

    //keccak256计算
    keccak256Count() {
      if (this.encodingType == "Hex") {
        //hex运算
        this.inputHash = this.inputHash.replace(/(^\s*)/g, "");
        let inputHash = this.inputHash;
        if (inputHash.indexOf("0x") != 0) {
          inputHash = "0x" + inputHash;
        }
        if (inputHash.length % 2 != 0) {
          inputHash = "0x0" + inputHash.slice(2);
        }
        try {
          this.outputHash = ethers.utils.keccak256(inputHash);
          this.canCopyHash = true;
        } catch (error) {
          this.outputHash = this.$t("hashTool.errorHexadecimal")
          this.canCopyHash = false;
        }
      } else {
        //这里进行text运算
        this.outputHash = ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes(this.inputHash)
        );
        this.canCopyHash = true;
      }
    },

    //base64计算
    base64Count() {
      if (this.isCoding == "coding") {
        if (this.encodingType == "Hex") {
          //Hex 编码
          try {
            this.inputHash = this.inputHash.replace(/(^\s*)/g, "");
            let inputHash = this.inputHash;
            if (inputHash.indexOf("0x") != 0) {
              inputHash = "0x" + inputHash;
            }
            if (inputHash.length % 2 != 0) {
              inputHash = "0x0" + inputHash.slice(2);
            }
            this.outputHash = ethers.utils.base64.encode(inputHash);
            this.canCopyHash = true;
          } catch (error) {
            this.outputHash = this.$t("hashTool.errorHexadecimal")
          }
        } else {
          //Text 编码
          this.outputHash = new Buffer(this.inputHash).toString("base64");
          this.canCopyHash = true;
        }
      } else if (this.isCoding == "deCoding") {
        if (this.encodingType == "Hex") {
          //Hex 解码
          try {
            let base64 = this.inputHash;
            var raw = atob(base64);
            var HEX = "";
            for (let i = 0; i < raw.length; i++) {
              var _hex = raw.charCodeAt(i).toString(16);
              HEX += _hex.length == 2 ? _hex : "0" + _hex;
            }
            this.outputHash = HEX;
            this.canCopyHash = true;
          } catch (error) {
            this.outputHash = this.$t("hashTool.decodingError")
          }
        } else {
          //Text解码
          try {
            this.outputHash = new Buffer(this.inputHash, "base64").toString();
            this.canCopyHash = true;
          } catch (error) {
            this.outputHash = this.$t("hashTool.decodingError")
          }
        }
      }

    },

    // 获取Hash
    getHash() {
      if (this.inputHash == "") {
        this.outputHash = this.$t("hashTool.noInput")
        return;
      }
      this.canCopyHash = false;
      if (this.algorithmSelection == 'Keccak-256') {
        this.keccak256Count();
      } else {
        this.base64Count()
      }
    },

    copy(text) {
      const clipboard = new Clipboard(".bottom", {
        text: () => {
          return text;
        },
      });
      clipboard.on("success", () => {
        this.$message.success(this.$t("pubilc.copySauccessfully"));
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        this.$message.error(this.$t("pubilc.copyFailed"));
        clipboard.destroy();
      });
    },
  },
};
</script>

<style scoped>
.HashView {
  width: 100%;
  height: auto;
  min-height: 94%;
}

select {
  border: #dcdfe6 1px solid;
  border-radius: 4px;
  height: 33px;
  width: 75px;
  margin-right: 5px;
}

.Hash {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  overflow: auto;
}

.el-radio {
  margin: 15px 5px;
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

.title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 15px;
  position:relative;
}

.usingHelp {
  width: 100%;
  height: 21px;
  margin-bottom: 5px;
}

.usingHelp span{
  float: right;
}

.usingHelp span a{
  text-decoration:none; 
  cursor:pointer;
  font-size: 15px;  
  color: #909399;
  width: 90px;
  display: inline-block;
}

.usingHelp span a:hover{
  color: #409eff;
}

.usingHelp span img{
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

.container .bottom {
  width: 100%;
  word-break: break-all;
  height: auto;
  margin-left: 10px;
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

.container div:nth-child(1){
    width: 135px;
}

/deep/ .tree-container .el-tree-node__children{
    width: 5000px;
}

/deep/ .container div:nth-child(1) div input{
    height: 34px;
    line-height: 34px;
}

.button {
  margin-left: 20px
}
</style>
