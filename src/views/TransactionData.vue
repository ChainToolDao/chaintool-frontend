<template>
  <div class="transactionData">
    <Navigation></Navigation>
    <div class="scroll">
      <div class="container">
        <div class="title">解析交易输入数据</div>
        <div class="tips">
          <span>
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
              <el-menu-item index="1">解析</el-menu-item>
              <el-menu-item index="2">编码</el-menu-item>
            </el-menu>
          </span>
        </div>

        <div v-if="page">
          <div class="tips">ABI Input Data</div>
          <el-input v-model="result" placeholder="Enter Result Data" @input="assignmentRadioBox()" type="textarea"
            autosize></el-input>
          <div class="tips">选择函数 <span> <el-radio-group v-model="radioValue" @click="adjustInputMode">
                <el-radio label="true" border size="medium" @change="adjustInputMode">自动选择</el-radio>
                <el-radio label="" border size="medium" @change="adjustInputMode">手动输入</el-radio>
              </el-radio-group></span>
          </div>
          <el-select v-model="choose" placeholder="Please Choose" v-if="!findFunction">
            <el-option v-for="(item, index) in results" :key="'chainlist' + index" :label="item" :value="item">
            </el-option>
          </el-select>
          <el-input v-model="choose" placeholder="Input Function" v-if="findFunction"></el-input>
          <div class="tips">结果</div>
          <el-table :data="data" border style="width: 100%">
            <el-table-column prop="#" label="#" width="40">
            </el-table-column>
            <el-table-column prop="argument" label="Argument" width="250">
            </el-table-column>
            <el-table-column label="value" width="413">
              <template slot-scope="scope">
                <div v-if='Array.isArray(scope.row.value)'>
                  <span @click="matrixing(scope.row.value[0])" style="color:#409EFF">{{ scope.row.value[0] }}</span>
                  <sub style="color:#409EFF">10</sub>
                  <span>(</span>
                  <span>{{ scope.row.value[1] }}</span>
                  <sub>16</sub>
                  <span>)</span>
                </div>
                <span v-if='!Array.isArray(scope.row.value)'> {{ scope.row.value }}</span>
              </template>
            </el-table-column>

          </el-table>

        </div>
        <div v-if="!page" class="hezi">
          <div class="tips">ABI Input Data</div>
          <el-input v-model="input" placeholder="请输入内容"></el-input>
          <el-input v-model="result" placeholder="Enter Result Data" @input="assignmentRadioBox()" type="textarea"
            autosize></el-input>
          <div class="tips">ABI Input Data</div>
          <el-input v-model="result" placeholder="Enter Result Data" @input="assignmentRadioBox()" type="textarea"
            autosize></el-input>
        </div>
        <div v-if="page">
          <div class="btn" @click="inquire">解析</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers";
import Navigation from "../components/Navigation.vue";
import intefUrl from "../interface";
import axios from "axios";

export default {
  name: "transactionData",
  components: {
    Navigation,
  },
  metaInfo() {
    return {
      title: "Chaintool - 解析交易输入数据",
      meta: [
        {
          name: "keyword",
          content: "解析交易输入数据，将Solidity字段编码为ETH ABI十六进制格式，编码",
        },
      ],
    };
  },
  data() {
    return {
      result: "",     //输入的数据
      data: [],       //输出的数据
      signature: [],  //用于存放解析的方法名
      choose: "",     //下拉框绑定的数值
      results: [],    //下拉框待选数值
      findFunction: false,
      radioValue: "true",
      activeIndex: "1",
      page: true,
    };
  },
  methods: {
    // 0x23b872dd0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c0000000000000000000000000000000000000000000000000de0b6b3a7640000
    handleSelect(key) {
      if (key == 1) {
        this.page = true
      } else {
        this.page = false
      }
    },
    matrixing(data) {
      let routeUrl = this.$router.resolve({
        name: "Unitconvert",
        query: { param: data }
      });
      window.open(routeUrl.href, '_blank');
    },
    adjustInputMode: function () {
      if (this.findFunction) {
        this.choose = this.results[0]
      } else {
        this.choose = ''
      }
      this.findFunction = !Boolean(this.radioValue)
    },
    signatureHandle(signature, parameter) {
      let completeSignature = "";
      if (escape(signature).indexOf("%u") >= 0) {
        return false;
      }
      signature = signature.replace(/^\s*/g, "");
      if (signature.indexOf("function ") == 0) {
        signature = signature.slice(8).replace(/^\s*/g, "");
      }
      if (signature != "") {
        completeSignature = signature.split(" ")[0].split("(")[0] + "(";
        if (
          signature.split("(")[0].replace(/(^\s*)|(\s*$)/g, "") + "(" !=
          completeSignature
        ) {
          return;
        }
      } else {
        return;
      }
      if (
        signature.replace(/\s+/g, "").indexOf("(") !=
        signature.replace(/\s+/g, "").indexOf(")") - 1 &&
        signature.indexOf("(") != -1 &&
        signature.indexOf(")") != -1
      ) {
        signature = signature.split("(")[1].split(")")[0].split(",");
        for (let i = 0; i < signature.length; i++) {
          signature[i] = signature[i].replace(/(^\s*)|(\s*$)/g, "");
          let verificationSignature = signature[i];
          signature[i] = signature[i]
            .replace(/^\s*/g, "")
            .split(" ")[0]
            .replace(/^\s+|\s+$/g, "");
          if (verificationSignature.split(" ").length >= 2) {
            if (
              verificationSignature
                .slice(signature[i].length)
                .replace(/(^\s*)|(\s*$)/g, "") !=
              verificationSignature.replace(/(^\s*)|(\s*$)/g, "").split(" ")[
              verificationSignature.replace(/(^\s*)|(\s*$)/g, "").split(" ")
                .length - 1
              ]
            )
              return;
          }
          let reg = /\d/;
          if (reg.test(signature[i])) {
            completeSignature = completeSignature + signature[i];
          } else {
            if (signature[i] == "int" || signature[i] == "uint") {
              completeSignature = completeSignature + signature[i] + "256";
            } else {
              completeSignature = completeSignature + signature[i];
            }
          }
          if (i == signature.length - 1) {
            completeSignature = completeSignature + ")";
          } else {
            completeSignature = completeSignature + ",";
          }
        }
      } else if (completeSignature.indexOf("(") != -1) {
        completeSignature = completeSignature + ")";
      } else {
        return false;
      }
      if (!parameter) {
        return completeSignature;
      } else {
        return signature
      }
    },

    async assignmentRadioBox() {
      this.data = []
      this.result = this.result.replace(/^\s*/, "");
      let result = []
      result[0] = this.result.substring(0, 10)
      let reverseLookupSign = result[0];
      if (reverseLookupSign.indexOf("0x") != 0) {
        reverseLookupSign = "0x" + reverseLookupSign;
      }
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
      } catch (error) {
      }
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
        result = signature.join(";");
      } else {
        result[0] = "你所查找的选择器暂未被记录，例：0x0dbe671f";
      }
      result = signature[0]
      for (let i in signature) {
        signature[i] = this.$options.methods.signatureHandle(
          signature[i]
        );
        signature[i] = "function " + signature[i]
      }
      const iface = new ethers.utils.Interface(signature);// 这里写入处理后的数组
      for (let i in signature) {
        signature[i] = signature[i].slice(9)
      }
      if (signature.length < 1) {
        this.results = []
        this.choose = ""
      } else {
        this.results = signature
        this.choose = this.results[0]
      }
    },
    async inquire() {
      //执行检测
      if (this.findFunction) {
        this.result = this.result.replace(/^\s*/, "");
        let conversionfunction = this.$options.methods.signatureHandle(this.choose);
        await axios
          .post(intefUrl.selector, {
            signature: conversionfunction,
            selector: this.result.substring(0, 10),
          })
          .then((res) => {
          });
      }
      this.data = []
      this.result = this.result.replace(/^\s*/, "");
      let result = []
      result[0] = this.result.substring(0, 10)
      let reverseLookupSign = result[0];
      if (reverseLookupSign.indexOf("0x") != 0) {
        reverseLookupSign = "0x" + reverseLookupSign;
      }
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
        result = signature.join(";");
      } else {
        result[0] = "你所查找的选择器暂未被记录，例：0x0dbe671f";
      }
      result = signature[0]
      for (let i in signature) {
        signature[i] = this.$options.methods.signatureHandle(
          signature[i]
        );
        signature[i] = "function " + signature[i]
      }
      const iface = new ethers.utils.Interface(signature);// 这里写入处理后的数组
      for (let i in signature) {
        signature[i] = signature[i].slice(9)
      }
      let dataResult = []
      let data = this.$options.methods.signatureHandle(
        this.choose, "1"
      )
      try {
        dataResult = iface.decodeFunctionData(this.choose, this.result)
      } catch (error) {
        this.$message.error("查询失败，请检查你的输入后重试");
        return
      }
      let valuedata = []
      for (let i in data) {
        if (dataResult[i]._hex) {
          let hexdata = [String(dataResult[i]), dataResult[i]._hex]
          valuedata.push(hexdata)
        } else {
          valuedata.push(dataResult[i])
        }

        let data2 = {
          "#": (parseInt(i) + 1),
          "argument": data[i],
          "value": valuedata[i]
        }
        this.data.push(data2)

      }
    },
  },
};
</script>

<style scoped>
.transactionData {
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

.hezi {
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

.container .tips {
  font-size: 14px;
  color: #000;
  font-weight: 700;
  align-self: flex-start;
  margin-bottom: 10px;
}

/* .el-menu-item{
   !important;
} */
.tips {
  margin-bottom: 20px;
}

.el-menu-demo {
  margin-bottom: 10px
}

.el-textarea {
  margin-bottom: 20px;
}

.container .el-select,
.container .el-input,
.container .el-textarea {
  width: 100%;
  margin-bottom: 30px;
}

.el-radio {
  margin: 0 20px;

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

.manualInput {
  font-size: 1px;
  color: rgb(0, 151, 182);
}
</style>
