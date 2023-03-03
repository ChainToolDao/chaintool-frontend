<template>
  <div class="HashView">
    <Navigation></Navigation>
    <div class="Hash">
      <div class="container">
        <h3>Hash 工具</h3>
        <div>
          <h5>Hash 工具</h5>
          <div>
            <el-radio-group v-model="algorithmSelection" @change="agreeChange">
              <el-radio label="1" border size="medium" @change="agreeChange"
                >Keccak-256</el-radio
              >
              <el-radio label="2" border size="medium" @change="agreeChange"
                >Base64</el-radio
              >
            </el-radio-group>
          </div>
          <div>
            <el-radio
              v-model="coding"
              label="1"
              v-if="algorithmSelection == 2"
              @change="agreeChange"
              >编码</el-radio
            >
            <el-radio
              v-model="coding"
              label="0"
              v-if="algorithmSelection == 2"
              @change="agreeChange"
              >解码</el-radio
            >
          </div>
          <div>
            <select name="" v-model="radio" id="">
              <option value="0"> Text </option>
              <option value="1"> Hex </option>
            </select>
            <el-input
              v-model="inputHash"
              placeholder="Input"
              type="textarea"
              autosize
            ></el-input>
            <el-button @click="obtainHash" style="margin-left: 20px"
              >确认</el-button
            >
          </div>
        </div>
        <h5 class="result">
          {{ outputHash
          }}<img
            class="stateCopy"
            v-if="stateCopyHash"
            src="../assets/imgs/copy.png"
            @click="copy(outputHash)"
          />
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
      title: "Chaintool - Hash工具",
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
      inputHash: "",
      outputHash: "",
      stateCopyHash: false,
      radio: "0",
      algorithmSelection: "1",
      coding: "1",
    };
  },
  methods: {
    agreeChange: function () {
      this.stateCopyHash = false;
      this.inputHash = "";
      this.outputHash = "";
    },
    // 获取Hash
    obtainHash() {
      if (this.inputHash == "") {
        this.outputHash = "你的输入为空，请重新输入";
        return;
      }
      this.stateCopyHash = false;
      if (this.algorithmSelection == 1) {
        if (this.inputHash == "") {
          this.outputHash = "你的输入不是16进制的字符，请重新输入";
          return;
        }
        if (this.radio == 1) {
          //这里进行hex运算
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
            this.stateCopyHash = true;
          } catch (error) {
            this.outputHash = "你的输入不是16进制的字符，请重新输入";
            this.stateCopyHash = false;
          }
        } else {
          //这里进行text运算
          this.outputHash = ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes(this.inputHash)
          );
          this.stateCopyHash = true;
        }
      } else {
        if (this.coding == 1) {
          if (this.radio == 1) {
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
              this.stateCopyHash = true;
            } catch (error) {
              this.outputHash = "你的输入不是16进制的字符，请重新输入";
            }
          } else {
            //Text 编码
            this.outputHash = new Buffer(this.inputHash).toString("base64");
            this.stateCopyHash = true;
          }
        } else if (this.coding == 0) {
          if (this.radio == 1) {
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
              this.stateCopyHash = true;
            } catch (error) {
              this.outputHash = "解码失败，请检查你的输入后重试";
            }
          } else {
            //Text解码
            try {
              this.outputHash = new Buffer(this.inputHash, "base64").toString();
              this.stateCopyHash = true;
            } catch (error) {
              this.outputHash = "解码失败，请检查你的输入后重试";
            }
          }
        }
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
.HashView {
  width: 100%;
  height: 100%;
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
  height: calc(100vh - 70px);
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
  word-break: break-all;
  height: auto;
  margin-left: 10px;
}
.stateCopy {
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
