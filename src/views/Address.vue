<template>
  <div class="addressView">
    <Navigation></Navigation>
    <div class="address">
      <div class="container">
        <h3>地址转换与ENS查询</h3>
        <div>
          <h5>地址</h5>
          <div>
            <el-input
              v-model="enterAddress"
              placeholder="Input Address"
            ></el-input>
            <el-button @click="addressTranslation">确认转换</el-button>
          </div>
        </div>
        <h5 class="result">
          {{ outputAddress }}
          <img
            src="../assets/imgs/copy.png"
            v-if="stateCopyaddress"
            class="stateCopy"
            @click="copy(outputAddress)"
          />
        </h5>
        <div>
          <h5>ENS</h5>
          <div>
            <el-input v-model="enterENS" placeholder="Input ENS"></el-input>
            <el-button @click="queryENS">确认查询</el-button>
          </div>
        </div>
        <h5 class="result">
          {{ outputENS }}
          <img
            src="../assets/imgs/copy.png"
            alt=""
            v-if="stateCopyENS"
            class="stateCopy"
            @click="copy(outputENS)"
          />
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
  name: "address",
  components: {
    Navigation,
  },
  metaInfo() {
    return {
      title: "Chaintool - 地址转换与ENS查询",

      meta: [
        {
          name: "keyword",
          content: "地址转换，ENS查询，地址转换与ENS查询",
        },
      ],
    };
  },
  data() {
    return {
      enterAddress: "",
      outputAddress: "",
      enterENS: "",
      outputENS: "",
      stateCopyaddress: false,
      stateCopyENS: false,
      load: false,
    };
  },
  methods: {
    addressTranslation() {
      this.enterAddress = this.enterAddress.toLowerCase();
      if (ethers.utils.isAddress(this.enterAddress)) {
        this.outputAddress = ethers.utils.getAddress(this.enterAddress);
        this.outputAddress = this.outputAddress;
        this.stateCopyaddress = true;
      } else {
        this.outputAddress =
          "您输入的地址不合法，请重新输入。输入示例：0x8ba1f109551bd432803012645ac136ddd64dba72";
        this.stateCopyaddress = false;
      }
    },
    async queryENS() {
      this.stateCopyENS = false;
      this.outputENS = "正在查询";
      this.load = true;
      let provider = new ethers.providers.InfuraProvider("mainnet");
      let pendingENS = "";
      if (ethers.utils.isAddress(this.enterENS)) {
        pendingENS = await provider.lookupAddress(this.enterENS);
      } else {
        pendingENS = await provider.resolveName(this.enterENS);
      }
      this.load = false;
      if (!pendingENS && typeof pendingENS !== "undefined" && pendingENS != 0) {
        pendingENS =
          "没有查询到对应的ENS，也没有查询到对应的地址 例”0x8ba1f109551bD432803012645Ac136ddd64DBA72“或“ricmoo.firefly.eth”";
      } else {
        this.stateCopyENS = true;
      }
      this.outputENS = pendingENS;
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
.addressView {
  width: 100%;
  height: 100%;
}
.address {
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
  /* border: solid red 1px; */
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
.container h3 {
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
