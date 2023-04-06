<template>
  <div class="bulkQuery">
    <Navigation></Navigation>
    <div class="scroll">
      <div class="container">
        <div class="title">{{$t("bulkQuery.title")}} <span><a href="https://github.com/ChainToolDao/chaintool-frontend/wiki/%E6%89%B9%E9%87%8F%E6%9F%A5%E8%AF%A2%E9%92%B1%E5%8C%85%E4%BD%99%E9%A2%9D"  target="_blank">{{$t("overall.usingHelp")}} <img src="../assets/imgs/explain.png" alt=""></a></span> </div>
        <!-- <div class="tips">查询网络</div>
        <el-select v-model="select">
          <el-option
            v-for="(item, index) in chainlist"
            :key="'chainlist' + index"
            :value="item.value"
          >
          </el-option>
        </el-select> -->
        <div class="tips">{{$t("bulkQuery.enterAddress")}}</div>
        <el-input v-model="tokenAdress" :placeholder="$t('bulkQuery.enterAddressPrompt')"></el-input>
        <div class="tips">{{$t("bulkQuery.enterWalletAddress")}}</div>
        <el-input
          type="textarea"
          v-model="walletAddress"
         :placeholder="$t('bulkQuery.enterWalletAddressPrompt')"
        ></el-input>
        <div class="tips">{{$t("bulkQuery.inquireResult")}}</div>
        <el-table
          :data="searchResult"
          border
          slot="empty"
          :empty-text="$t('bulkQuery.list[3]')"
          v-loading="isloading"
          id="outExcel"
          class="table"
        >
          <el-table-column prop="walletAddress" :label="$t('bulkQuery.list[0]')" width="363">
          </el-table-column>
          <el-table-column prop="token" :label="$t('bulkQuery.list[1]')" width="90">
          </el-table-column>
          <el-table-column prop="balance" :label="$t('bulkQuery.list[2]')" width="250">
          </el-table-column>
        </el-table>
        <div>
          <div class="bottomBtn" @click="checkBalance">{{$t("bulkQuery.checkBalance")}}</div>
          <span class="bottomBtn" @click="exportexcel">{{$t("bulkQuery.exportExcel")}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers";
import Navigation from "../components/Navigation.vue";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";

export default {
  name: "bulkQuery",
  components: {
    Navigation,
  },
  metaInfo() {
    return {
      title: "Chaintool - " + this.title,

      meta: [
        {
          name: "keyword",
          content: "批量查询钱包余额，通过钱包地址查询余额",
        },
      ],
    };
  },

  data() {
    return {
      select: "https://mainnet-eth.compound.finance/",
      chainlist: [
        {
          value: "https://mainnet-eth.compound.finance/",
        },

        {
          value: "https://http-mainnet.hecochain.com",
        },

        {
          value: "https://bsc-dataseed3.binance.org",
        },

        {
          value: "https://rpc-mainnet.matic.network",
        },
      ],
      //代币地址
      tokenAdress: "",
      //钱包地址  
      walletAddress: "",
      //查询结果
      searchResult: [],
      //是加载中
      isloading: false,
    };
  },

  async created() {
    await this.initAccount();
  },

  computed:{
      title(){
	      return this.$t("title.bulkQuery")
	    }
  },

  methods: {
    //导出excel
    exportexcel() {
      if (this.searchResult.length == 0) {
        this.$message(this.$t('bulkQuery.exportExcelPrompt'));
        return;
      }
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
          "钱包余额表格.xlsx"
        );
      } catch (error) {
      }
      return wbout;
    },

    //查询余额
    async checkBalance() {
      this.searchResult = [];
      let walletBalance = [];
      let token = [];
      let walletAddress = this.walletAddress.split("\n");
      let provider = new ethers.providers.InfuraProvider("mainnet");
      if (this.walletAddress == "") {
        this.$message(this.$t('bulkQuery.checkBalancePrompt[0]'));
        return;
      }
      this.isloading = true;
      if (this.tokenAdress == "") {
        for (let i in walletAddress) {
          try {
            walletBalance[i] = await (
              await provider.getBalance(walletAddress[i])
            )._hex;
            token[i] = "ETH";
          } catch (error) {
            walletBalance[i] = "查询失败";
          }
        }
      } else {
        try {
          var source = await provider.getCode(this.tokenAdress);
        } catch (error) {
          var source = 1;
        }
        if (source == 1 || source.length == 2) {
          this.$message(this.$t('bulkQuery.checkBalancePrompt[1]'));
          return;
        }
        let abi = [
          "function balanceOf(address) view returns (uint256)",
          "function symbol() view returns (string)",
        ];
        let contract = new ethers.Contract(this.tokenAdress, abi, provider);
        for (let i in walletAddress) {
          try {
            let balance = await contract.balanceOf(walletAddress[i]);
            walletBalance.push(balance._hex);
            let tokenAddress = await contract.symbol();
            token[i] = tokenAddress;
          } catch (error) {
            walletBalance.push("查询失败");
          }
        }
      }
      for (let i in walletAddress) {
        walletBalance[i] = parseInt(walletBalance[i], 16);
        let data = {
          walletAddress: walletAddress[i],
          balance: walletBalance[i],
          // token:token[i]
          token: "ETH",
        };
        this.searchResult.push(data);
      }
      this.isloading = false;
    },

    // ----------初始化账户-------------
    async initAccount() {
      if (window.ethereum) {
        try {
          this.accounts = await window.ethereum.enable();
          this.account = this.accounts[0];
          this.provider = window.ethereum;
          this.signer = new ethers.providers.Web3Provider(
            this.provider
          ).getSigner();
          this.chainId = parseInt(
            await window.ethereum.request({ method: "eth_chainId" })
          );
        } catch (error) {
          // User denied account access
        }
      } else {
        // Need install MetaMask
      }
      // Verify Accounts!
    },
  },
};
</script>

<style scoped>
.bulkQuery {
  width: 100%;
  height: auto;
  min-height: 94%;
}

.scroll {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  overflow: auto;
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
  margin-bottom: 24px;
  position:relative;
}

.title span a{
	text-decoration:none;
	cursor:pointer;
	position: absolute;
	font-size: 15px;
	margin-left:25% ;
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

.container .tips {
  font-size: 14px;
  color: #000;
  font-weight: 700;
  align-self: flex-start;
  margin-bottom: 10px;
}

.container .el-select,
.container .el-input,
.container .el-textarea {
  width: 100%;
  margin-bottom: 30px;
}

/deep/ .container .el-select .el-input__inner,
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

.container .list .header > div:last-child {
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

.container .bottomBtn {
  vertical-align:top;
  flex-direction: row;
  display: inline-block;
  text-align: center;
  margin-top: 10px;
  margin-left: 20px;
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

.container .bottomBtn:hover {
  background-color: #575757;
}

.container .bottomBtn:active {
  background-color: #000;
}

@media (max-width: 808px) {
  .container {
    max-width: calc(100vw - 40px);
  }
}
.table{
  width: 100%;
}
</style>