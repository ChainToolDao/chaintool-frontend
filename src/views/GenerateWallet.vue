<template>
  <div class="generateWallet" v-loading="loading">
    <Navigation></Navigation>
    <div class="wallet">
      <div class="container">
        <h3>批量生成EVM钱包</h3>
        <div class="tips">
          <span>Tips: 钱包生成过程均在本地完成，代码完全<a href="https://github.com/ChainToolDao" target="_blank">开源</a>。任何人都无法获取到您的助记词及私钥，请放心使用。<br></span>
        </div>
        <div>
          <el-radio v-model="generateMethod" label="randomBatch" @change="emptyWalletData">随机批量生成</el-radio>
          <el-radio v-model="generateMethod" label="customize" @change="emptyWalletData">自定义私钥或助记词创建</el-radio>
        </div>
        <div v-if="generateMethod == 'randomBatch'">
          <div>
            <h5>选择助记词长度</h5>
          </div>
          <div>
            <el-radio v-model="mnemonicLength" label="12" border size="medium">12位</el-radio>
            <el-radio v-model="mnemonicLength" label="15" border size="medium">15位</el-radio>
            <el-radio v-model="mnemonicLength" label="18" border size="medium">18位</el-radio>
            <el-radio v-model="mnemonicLength" label="21" border size="medium">21位</el-radio>
            <el-radio v-model="mnemonicLength" label="24" border size="medium">24位</el-radio>
          </div>
          <div>
            <h5>生成钱包的地址数量</h5>
          </div>
          <div>
            <div>
              <el-input v-model="walletQuantity" placeholder="Input Number Of Wallets"></el-input>
              <el-button v-if="!hasBuildState" @click="generateWallet()">立即生成</el-button>
              <el-button v-if="hasBuildState" @click="generateWallet">重新生成</el-button>
              <el-button v-if="hasBuildState" @click="exportexcel">下载表格</el-button>
            </div>
          </div>
        </div>
        <div v-if="generateMethod == 'customize'">
          <div>
            <h5>通过私钥或助记词创建钱包</h5>
          </div>
          <div>
            <div>
              <el-input v-model="inputPrivateKey" placeholder="Enter private key or mnemonic"></el-input>
              <el-button @click="createWallet()">立即创建</el-button>
            </div>
          </div>
        </div>
        <div class="scroll">
          <div class="data" v-for="(data, index) in walletdata" :key="index">
            <div>
              <h5>
                <span class="dataTitle"> 地址</span><span class="verticalLine"></span>
                <span class="dataBox"><span class="roll">{{ data.address }}</span></span><span class="dataReplication"
                  @click="copy(data.address)">复制</span>
              </h5>
              <h5>
                <span class="dataTitle">助记词</span><span class="verticalLine"></span>
                <span class="dataBox"><span class="roll">{{ data.mnemonic }}</span></span><span class="dataReplication"
                  @click="copy(data.mnemonic)">复制</span>
              </h5>
              <h5>
                <span class="dataTitle">密钥</span><span class="verticalLine"></span>
                <span class="dataBox"><span class="roll">{{ data.privateKey }}</span></span>
                <span class="dataReplication" @click="copy(data.privateKey)">复制</span>
              </h5>
            </div>
          </div>
        </div>

        <el-table :data="walletdata" class="el-table" id="outExcel">
          <el-table-column prop="address" label="地址"> </el-table-column>
          <el-table-column prop="mnemonic" label="助记词"> </el-table-column>
          <el-table-column prop="privateKey" label="私钥"> </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import Navigation from "../components/Navigation.vue";
import Clipboard from "clipboard";
import { ethers } from "ethers";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
export default {
  name: "generateWallet",
  components: {
    Navigation,
  },
  metaInfo() {
    return {
      title: "Chaintool - 批量生成 EVM 钱包",

      meta: [
        {
          name: "keyword",
          content: "生成 EVM 钱包,批量生成 EVM 钱包",
        },
      ],
    };
  },
  data() {
    return {
      //钱包数量
      walletQuantity: "1",
      //助记词长度
      mnemonicLength: "12",
      //有生成状态
      hasBuildState: false,
      //钱包数据
      walletdata: [],
      //加载中
      loading: false,
      //生成方式   
      generateMethod: "randomBatch",
      inputPrivateKey: "",
    };
  },
  methods: {
    //清空钱包数据
    emptyWalletData: function () {
      this.walletdata = [];
    },

    //生成钱包数据
    generateWalletData() {
      this.walletdata = [];
      if (!this.mnemonicLength || !this.walletQuantity) {
        this.$message({
          message: "你没有选择助记词长度或没有填入生成钱包的地址数量",
          type: "warning",
        });
        this.loading = !this.loading;
        return;
      } else {
        this.walletQuantity = parseInt(this.walletQuantity);
        if (!this.walletQuantity || this.walletQuantity < 1) {
          this.$message({
            message:
              "你写入的生成钱包的地址数量非数字或小于1，无法生成，请重新输入",
            type: "warning",
          });
          this.walletQuantity = "";

          this.loading = !this.loading;
          return;
        }
        if (this.walletQuantity > 100) {
          this.$message({
            message:
              "你写入的钱包数量大于100，无法生成。请输入不大于100的生成数量。",
            type: "warning",
          });
          this.walletQuantity = "";

          this.loading = !this.loading;
          return;

        }
        for (let i = 0; i < this.walletQuantity; i++) {
          let mnemonicLength = ((this.mnemonicLength - 12) / 3) * 4 + 16;
          var mnemonic = ethers.utils.entropyToMnemonic(
            ethers.utils.randomBytes(mnemonicLength)
          ); // 生成助记词
          var path = "m/44'/60'/0'/0/0";
          var wallet = ethers.Wallet.fromMnemonic(mnemonic, path); //通过助记词创建钱包

          this.hasBuildState = true;
          var wallet = {
            address: wallet.address,
            mnemonic: mnemonic,
            privateKey: wallet.privateKey,
          };
          this.walletdata.push(wallet);
        }
        this.loading = !this.loading;
      }
    },

    //导出excel
    exportexcel() {
      /** 从表生成工作簿对象*/
      const wb = XLSX.utils.table_to_book(document.querySelector("#outExcel"), {
        raw: true,
      });
      /** 获取二进制字符串作为输出 */
      const wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          //设置导出文件名称
          "EVM钱包.xlsx"
        );
      } catch (e) { }
      return wbout;
    },

    //生成钱包
    generateWallet() {
      this.loading = !this.loading;
      let that = this;
      setTimeout(function () {
        that.generateWalletData();
      }, 30);
    },

    //通过私钥或助记词创建钱包
    createWallet() {
      this.walletdata = [];
      try {
        // 通过助记词创建钱包对象
        var path = "m/44'/60'/0'/0/0";
        var wallet = ethers.Wallet.fromMnemonic(this.inputPrivateKey, path);
        var wallet = {
          address: wallet.address,
          mnemonic: wallet.mnemonic.phrase,
          privateKey: wallet.privateKey,
        };
        this.walletdata.push(wallet);
        return;
      } catch (error) { }
      try {
        // 通过私钥创建钱包对象
        if (this.inputPrivateKey.substring(0, 2) !== "0x") {
          this.inputPrivateKey = "0x" + this.inputPrivateKey;
        }
        var wallet = new ethers.Wallet(this.inputPrivateKey);
        var wallet = {
          address: wallet.address,
          mnemonic: wallet.mnemonic,
          privateKey: wallet.privateKey,
        };
        this.walletdata.push(wallet);
      } catch (error) {
        this.inputPrivateKey = ""
        this.$message.error("创建失败，请检查你的输入");
      }
    },

    copy(text) {
      const clipboard = new Clipboard(".dataReplication", {
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
.generateWallet {
  min-width: 636px;
  width: 100%;
  height: 100%;
}

.wallet {
  min-width: 636px;
  height: calc(100vh - 70px);
  display: flex;
  justify-content: center;
  overflow: auto;
}

.container {
  min-width: 700px;
  max-width: 768px;
  padding: 32px;
  width: 100%;
  height: min-content;
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
  margin-bottom: 50px;
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

.scroll {
  height: auto;
  max-height: 500px;
  overflow: auto;
}

.data {
  min-width: 690px;
  overflow: hidden;
  padding-left: 10px;
  height: auto;
  margin: 15px 0;
}

.data div {
  flex-direction: column;
}

.data div h5 {
  background-color: #f0f0f0;
  height: 40px;
  margin: 2px 0;
}

.data div h5 span {
  display: inline-block;
  color: #000;
}

.data div .dataTitle {
  font-weight: 300;
  float: left;
  padding: 0;
  display: inline-block;
  text-align: center;
  width: 77px;
  height: 40px;
  line-height: 33px;
  margin: 5px 0;
  color: #da2121;
}

.container .tips {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  color: #ff9f37;
  font-size:15px
}

.container .tips span a{
  color: #ff9f37;
  text-decoration:none;
}

.container .tips span a:hover{
  color: #409eff;
}

.data div .dataBox {
  font-weight: 350;
  padding-top: 13px;
  width: 520px;
  height: 47px;
  word-break: keep-all;
  overflow-x: scroll;
}

.data div .dataBox .roll {
  white-space: nowrap;
  width: auto;
}

.data div .dataReplication {
  width: 67px;
  height: 38px;
  line-height: 38px;
  text-align: center;
  float: right;
  color: #1d4ed8;
  border: 1px solid #e9e9e9;
  background-color: #ffffff;
}

.data div .verticalLine {
  float: left;
  margin-right: 10px;
  height: 38px;
  border: solid 1px rgb(221, 221, 221);
}

.el-table {
  position: absolute;
  left: -5000px;
}

.stateCopy {
  width: 15px;
  height: 15px;
  margin-left: 10px;
}
</style>