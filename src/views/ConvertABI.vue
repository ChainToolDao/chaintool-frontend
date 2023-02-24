<template>
  <div class="ABIView">
    <Navigation></Navigation>
    <div class="ABI">
      <div class="container">
        <h3>函数签名获取选择器</h3>
        <div>
          <h5>获取选择器</h5>
          <div>
            <el-input v-model="enterABI" placeholder="Enter The Function Signature"></el-input>
            <el-button @click="aBITranslation">确认获取</el-button>
          </div>
        </div>
        <h5 class="result">
          {{ outputABI
          }}<img class="stateCopy" v-if="stateCopyABI" src="../assets/imgs/copy.png" @click="copy(outputABI)" />
        </h5>

        <div>
          <h5>获取函数签名</h5>
          <div>
            <el-input v-model="reverseLookupSign" placeholder="Input Selector"></el-input>
            <el-button @click="querySignature()">确认获取</el-button>
          </div>
        </div>
        <h5 class="result">
          {{ signature }}
          <img src="../assets/imgs/copy.png" alt="" v-if="reverseLookup" class="stateCopy" @click="copy(signature)" />
          <img class="load" src="../assets/imgs/load.gif" alt="" v-if="load" />
        </h5>
      </div>
    </div>
  </div>
</template>
<script>
import Navigation from "../components/Navigation.vue";
import Clipboard from "clipboard";
import intefUrl from "../interface";
import { ethers } from "ethers";
import axios from "axios";
export default {
  name: "convertABI",
  components: {
    Navigation,
  },
  metaInfo() {
    return {
      title: "Chaintool - 函数签名获取选择器",

      meta: [
        {
          name: "keyword",
          content: "函数签名获取选择器,选择器获取函数签名",
        },
      ],
    };
  },
  data() {
    return {
      enterABI: "",
      outputABI: "",
      reverseLookupSign: "",
      signature: "",
      stateCopyABI: false,
      reverseLookup: false,
      load: false,
    };
  },
  methods: {
    signatureHandle(signature) {
      if (signature.indexOf("function ") == 0) {
        signature = signature.slice(8).replace(/^\s*/g, "");
      }
      return signature   
    },
    async aBITranslation() {
      let ABI = [];
      ABI[0] = this.$options.methods.signatureHandle(this.enterABI);
      if (ABI[0]) {
        ABI[0] = "function " + ABI[0];
      } else {
        this.outputABI =
          "你输入的函数有误，请重新输入!  请用如下格式输入，例：transfer(address,uint256)";
        return;
      }
      try {
        let iface = new ethers.utils.Interface(ABI);
        ABI[0] = ABI[0].slice(9);
        this.outputABI = iface.getSighash(ABI[0]);
        this.stateCopyABI = true;
        try {
          axios
            .post(intefUrl.selector, {
              signature: ABI[0],
              selector: this.outputABI,
            })
            .then((res) => { });
        } catch (error) { }
      } catch (error) {
        this.stateCopyABI = false;
        this.outputABI = "你输入的函数有误，请重新输入";
      }
    },
    async querySignature() {
      let reverseLookupSign = this.reverseLookupSign;
      if (reverseLookupSign.indexOf("0x") != 0) {
        reverseLookupSign = "0x" + reverseLookupSign;
      }
      this.signature = "正在查询";
      this.load = true;
      this.reverseLookup = false;
      let signature = [];
      try {
        await axios
          .get(intefUrl.selector + "/" + reverseLookupSign)
          .then((res) => {
            for (let i in res.data.data) {
              res.data.data[i] = this.$options.methods.signatureHandle(
                res.data.data[i]
              );
              if (signature.indexOf(res.data.data[i]) == -1) {
                signature.push(res.data.data[i]);
              }
            }
          });
      } catch (error) { }
      reverseLookupSign = reverseLookupSign.slice(2);
      try {
        await axios
          .get(
            "https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/" +
            reverseLookupSign
          )
          .then((res) => {
            let data = res.data.split(";");
            for (let i in data) {
              data[i] = this.$options.methods.signatureHandle(data[i]);
              if (signature.indexOf(data[i]) == -1) {
                signature.push(data[i]);
                //执行数据库添加操作
                axios
                  .post(intefUrl.selector, {
                    signature: data[i],
                    selector: "0x" + reverseLookupSign,
                  })
                  .then((res) => { });
              }
            }
          });
      } catch (error) { }
      try {
        await axios
          .get(
            "https://raw.githubusercontent.com/ethereum-lists/4bytes/master/with_parameter_names/" +
            reverseLookupSign
          )
          .then((res) => {
            let data = res.data.split(";");
            for (let i in data) {
              data[i] = this.$options.methods.signatureHandle(data[i]);
              if (signature.indexOf(data[i]) == -1) {
                signature.push(data[i]);
                //执行数据库添加操作
                axios
                  .post(intefUrl.selector, {
                    signature: data[i],
                    selector: "0x" + reverseLookupSign,
                  })
                  .then((res) => { });
              }
            }
          });
      } catch (error) { }

      if (signature.length >= 1) {
        this.signature = signature.join(";");
        this.reverseLookup = true;
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
  height: 100%;
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
