<template>
  <div class="bulkQuery">
    <Navigation></Navigation>
    <div class="scroll">
      <div class="container">
        <div class="title">批量查询钱包余额</div>

        <div class="tips">查询网络</div>

        <el-select v-model="select">
          <el-option
            v-for="(item, index) in chainlist"
            :key="'chainlist' + index"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <div class="tips">代币地址</div>

        <el-input v-model="tokenAdress" placeholder="默认 ETH 地址"></el-input>

        <div class="tips">钱包地址</div>

        <el-input
          type="textarea"
          v-model="listAddress"
          placeholder="一行输入一个地址"
        ></el-input>

        <div class="tips">查询结果</div>
        <el-table
          :data="searchResult"
          border
          style="width: 100%"
          v-loading="loading"
          id="outExcel"
        >
          <el-table-column prop="walletAddress" label="钱包地址" width="403">
          </el-table-column>
          <el-table-column prop="token" label="代币" width="50">
          </el-table-column>
          <el-table-column prop="balance" label="余额" width="250">
          </el-table-column>
        </el-table>

        <div>
          <div class="btn" @click="checkTheBalance">查询余额</div>
          <span class="btn" @click="exportexcel">下载表格</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers";
import Navigation from "../components/Navigation.vue";
import * as XLSX from "xlsx";

export default {
  name: "bulkQuery",
  components: {
    Navigation,
  },
  metaInfo() {
    return {
      title: "Chaintool - 批量查询钱包余额",

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
      tokenAdress: "",
      listAddress: "",
      walletnum: "",
      web3: "",
      wallet_arr: [],
      value: "",
      searchResult: [],
      loading: false,
      walletlist: null,
      swallet: null,
      balance: null,
      humanread: null,
      tokenAddress: null,
    };
  },

  async created() {
    await this.initAccount();
  },

  methods: {
    exportexcel() {
      if (this.searchResult.length == 0) {
        this.$message("你当前还没有查询余额，请查询余额后再进行下载表格");
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
      } catch (e) {}
      return wbout;
    },
    async checkTheBalance() {
      this.searchResult = [];
      let walletBalance = [];
      let token = [];
      let listAddress = this.listAddress.split("\n");
      let provider = new ethers.providers.InfuraProvider("mainnet");
      if (this.listAddress == "") {
        this.$message("你还没有输入钱包地址，请输入钱包地址后重试");
        return;
      }
      this.loading = true;
      if (this.tokenAdress == "") {
        for (let i in listAddress) {
          try {
            walletBalance[i] = await (
              await provider.getBalance(listAddress[i])
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
          this.$message("你输入代币地址错误，请重新输入后重试");
          return;
        }
        let abi = [
          "function balanceOf(address) view returns (uint256)",
          "function symbol() view returns (string)",
        ];
        let contract = new ethers.Contract(this.tokenAdress, abi, provider);
        for (let i in listAddress) {
          try {
            let balance = await contract.balanceOf(listAddress[i]);
            walletBalance.push(balance._hex);
            let tokenAddress = await contract.symbol();
            token[i] = tokenAddress;
          } catch (error) {
            walletBalance.push("查询失败");
          }
        }
      }

      for (let i in listAddress) {
        walletBalance[i] = parseInt(walletBalance[i], 16);
        let data = {
          walletAddress: listAddress[i],
          balance: walletBalance[i],
          // token:token[i]
          token: "ETH",
        };
        this.searchResult.push(data);
      }
      this.loading = false;
    },

    // ----------初始化账户-------------
    async initAccount() {
      if (window.ethereum) {
        console.log(window.ethereum);
        try {
          this.accounts = await window.ethereum.enable();
          console.log("accounts:" + this.accounts);
          this.account = this.accounts[0];
          this.provider = window.ethereum;
          this.signer = new ethers.providers.Web3Provider(
            this.provider
          ).getSigner();
          this.chainId = parseInt(
            await window.ethereum.request({ method: "eth_chainId" })
          );
        } catch (error) {
          console.log("User denied account access", error);
        }
      } else {
        console.log("Need install MetaMask");
      }
      console.log("Verify Accounts!");
      console.log(this.accounts.toString());
    },
  },
};
</script>

<style scoped>
.bulkQuery {
  width: 100%;
  height: 100%;
}

.scroll {
  width: 100%;
  height: calc(100vh - 70px);
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

.container .btn {
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

.container .btn:hover {
  background-color: #575757;
}

.container .btn:active {
  background-color: #000;
}

@media (max-width: 808px) {
  .container {
    max-width: calc(100vw - 40px);
  }
}
</style>