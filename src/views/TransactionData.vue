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
          <div class="tips"> Input Calldata</div>
          <el-input v-model="result" placeholder="Enter Calldata" @input="assignmentRadioBox()" type="textarea"
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
          <el-input v-model="choose" placeholder="Input Function " v-if="findFunction"></el-input>
          <div v-if="page">
            <div class="btn analyze" @click="inquire">解析</div>
          </div>
          <div class="tips">解析结果</div>
          <el-table :data="data" style="width: 100%; " row-key="id" border :row-class-name="tableRowClassName"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <el-table-column prop="id" label="参数" width="150">
            </el-table-column>
            <el-table-column label="参数类型" width="150">
              <template slot-scope="scope">
                <div v-if='Array.isArray(scope.row.argument)'>
                  <span style="line-height:25px">(</span>
                  <span v-for=" i, index  in scope.row.argument" style="line-height: 26px;">
                    <span v-if="index == 0">{{ i }},</span>
                    <div v-else-if="index != 0 && index + 1 != scope.row.argument.length">
                      {{ i }},
                    </div>
                    <span v-else-if="index + 1 == scope.row.argument.length">{{ i }}</span>
                  </span>
                  <span>)</span>
                </div>
                <span v-else=""> {{ scope.row.argument }}</span>
              </template>
            </el-table-column>
            <el-table-column label="值" width="420">
              <template slot-scope="scope">
                <div v-if='Array.isArray(scope.row.value)'>
                  <span v-if="Array.isArray(scope.row.value[0])">
                    <span>[(</span>
                    <span v-for="i, index in scope.row.value[0]">
                      <span v-if="scope.row.value[0][index].toString().indexOf('0x') == -1">
                        <span @click="matrixing(scope.row.value[0][index])" style="color:#409EFF">{{
                          scope.row.value[0][index]
                        }}</span>
                        <sub style="color:#409EFF">10</sub>
                        <span>(</span>
                        <span>{{ Conversion(scope.row.value[0][index]) }}</span>
                        <sub>16</sub>
                        <span>)</span>
                        <span v-if="index + 1 != scope.row.value[0].length"><span>,</span> </span>
                      </span>
                      <span v-else>
                        {{ i }}
                        <span v-if="index + 1 != scope.row.value[0].length"> <span>,</span> <br></span>
                      </span>
                    </span>
                    <span>)]</span>
                  </span>
                  <span v-else>
                    <span v-if='!Array.isArray(scope.row.argument)'>
                      <span v-if="scope.row.argument.indexOf('[]') != -1">
                        <span>[</span>
                      </span>
                    </span>
                    <span v-for="i, index in scope.row.value">
                      <span v-if="scope.row.value[index].toString().indexOf('0x') == -1">
                        <span @click="matrixing(scope.row.value[index])" style="color:#409EFF">{{ scope.row.value[index]
                        }}</span>
                        <sub style="color:#409EFF">10</sub>
                        <span>(</span>
                        <span>{{ Conversion(scope.row.value[index]) }}</span>
                        <sub>16</sub>
                        <span>)</span>
                        <span v-if="index + 1 != scope.row.value.length"><span>,</span> <br></span>
                      </span>
                      <span v-else>
                        {{ i }}
                        <span v-if="index + 1 != scope.row.value.length"> <span>,</span> <br></span>
                      </span>
                    </span>
                    <span v-if='!Array.isArray(scope.row.argument)'>
                      <span v-if="scope.row.argument.indexOf('[]') != -1">
                        <span>]</span>
                      </span>
                    </span>
                  </span>
                </div>
                <span v-else=""> {{ scope.row.value }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="!page" class="hezi">
          <div class="tips">输入函数</div>
          <el-input v-model="inputFunction" placeholder="请输入函数"></el-input>
          <div class="tips">参数</div>
          <el-input v-model="parameter" placeholder="一行输入一个参数" type="textarea"></el-input>
          <h5 class="result">
            {{ encodingResult
            }}<img class="stateCopy" v-if="stateCopy" src="../assets/imgs/copy.png" @click="copy(encodingResult)" />
          </h5>
        </div>
        <div class="btn " v-if="!page" @click="coding()">编码</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers";
import Navigation from "../components/Navigation.vue";
import intefUrl from "../interface";
import axios from "axios";
import Clipboard from "clipboard";
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
      result: "0x23b872dd0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c0000000000000000000000000000000000000000000000000de0b6b3a7640000",     //输入的数据
      signature: [],
      choose: "",
      results: [],
      findFunction: false,
      radioValue: "true",
      activeIndex: "1",
      page: true,
      inputFunction: "",
      parameter: "",
      encodingResult: "",
      stateCopy: false,
      data: [],
    };
  },
  mounted() {
    //进入页面先执行自动获取函数
    this.assignmentRadioBox()
  },
  methods: {
    //改变带下拉部分的样式
    tableRowClassName({ row, rowIndex }) {
      if (String(JSON.parse(JSON.stringify(row.id))).indexOf("[var") == "-1") {
        return 'success-row';
      }
      return '';
    },
    //表格展示的数据进行处理
    Conversion(decimal) {
      let hex
      if (decimal._hex) {
        hex = decimal._hex.toString(16)
      } else {
        hex = "0x" + parseInt(decimal).toString(16)
      }
      return hex
    },
    //编码
    coding() {
      //清空上次编码的数据
      this.encodingResult = ""
      try {
        let processingParameters = this.parameter.split("\n")
        this.stateCopy = false
        let inputFunction = this.inputFunction.replace(/^\s*/g, "");
        if (inputFunction.indexOf("function ") != 0) {
          inputFunction = "function " + inputFunction
        }
        const iface = new ethers.utils.Interface([inputFunction,]);
        inputFunction = inputFunction.slice(8).replace(/^\s*/g, "");
        this.encodingResult = iface.encodeFunctionData(inputFunction, processingParameters)
        //把通过编码的数据加入数据库
        try {
          axios
            .post(intefUrl.selector, {
              signature: inputFunction,
              selector: (this.encodingResult.substring(0, 10)),
            })
            .then((res) => { });
        } catch (error) {
        }
        this.stateCopy = true
      } catch (error) {
        this.encodingResult = "你的输入有误，请检查后重试"
      }
    },
    // 编码与解码的切换
    handleSelect(key) {
      if (key == 1) {
        this.page = true
      } else {
        this.page = false
      }
    },
    // 跳转新窗口-单位转换
    matrixing(data) {
      let routeUrl = this.$router.resolve({
        name: "Unitconvert",
        query: { param: data }
      });
      window.open(routeUrl.href, '_blank');
    },
    //切换函数输入方式是自动选择还是手动输入
    adjustInputMode: function () {
      if (this.findFunction) {
        this.choose = this.results[0]
      } else {
        this.choose = ''
      }
      this.findFunction = !Boolean(this.radioValue)
    },
    // 函数签名处理
    signatureHandle(signature) {
      if (signature.indexOf("function ") == 0) {
        signature = signature.slice(8).replace(/^\s*/g, "");
      }
      return signature
    },
    //自动获取函数的方法
    async assignmentRadioBox() {
      try {
        // 取ABIData关于函数签名部分
        let reverseLookupSign = this.result.slice(0, 10)
        // signature用于放置返回的全部结果
        let signature = [];
        try {
          await axios
            .get(intefUrl.selector + "/" + reverseLookupSign)
            .then((res) => {
              for (let i in res.data.data) {
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
        this.results = signature
        if (!this.findFunction) {
          this.choose = signature[0]
        }
      } catch (error) { }
    },
    //  执行解析
    async analyze(ABIData, sign) {
      try {
        //判断是否存在函数签名，不存在则自动获取函数签名
        if (sign == undefined || sign == "") {
          // 取ABIData关于函数签名部分
          let reverseLookupSign = ABIData.slice(0, 10)
          // signature用于放置返回的全部结果
          let signature = [];
          try {
            await axios
              .get(intefUrl.selector + "/" + reverseLookupSign)
              .then((res) => {
                for (let i in res.data.data) {
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
          sign = signature[0]
        } else {
          try {
            axios
              .post(intefUrl.selector, {
                signature: sign,
                selector: ABIData.slice(0, 10),
              })
              .then((res) => { });
          } catch (error) { }
        }
        sign = 'function ' + sign
        const iface = new ethers.utils.Interface([sign,]);
        sign = sign.slice(9, sign.length)
        //获取解析结果
        let dataResult = iface.decodeFunctionData(sign, ABIData)
        let typeArray = []
        let nameArray = []
        for (let i = 0; i < iface.fragments[0].inputs.length; i++) {
          nameArray.push(iface.fragments[0].inputs[i].name)
          if (iface.fragments[0].inputs[0].type == "tuple") {
            let subTypeArray = []
            for (let k = 0; k < iface.fragments[0].inputs[0].components.length; k++) {
              subTypeArray.push(iface.fragments[0].inputs[i].components[k].type)
            }
            typeArray.push(subTypeArray)
          } else {
            if (iface.fragments[0].inputs[i].type == "tuple[]") {
              let Array = "("
              for (let k = 0; k < iface.fragments[0].inputs[i].components.length; k++) {
                Array = Array + iface.fragments[0].inputs[i].components[k].type
                if (k < iface.fragments[0].inputs[i].components.length - 1) {
                  Array = Array + ","
                }
              }
              Array = Array + ")[]"
              typeArray.push(Array)
            } else {
              typeArray.push(iface.fragments[0].inputs[i].type)
            }
          }
        }
        return [typeArray, dataResult, sign, nameArray]
      } catch (error) { }
    },
    async queryResultProcessing(data) {
      try {
        let processResult = []
        for (let i = 0; i < data[1].length; i++) {
          if (Array.isArray(data[1][i])) {
            // multicall进行再次解析
            if (data[2].indexOf("multicall(") != -1) {
              for (let k = 0; k < data[1][i].length; k++) {
                let secondaryCallData = await this.analyze(data[1][i][k])
                let methodname = secondaryCallData[2]
                let analysisResult = await this.queryResultProcessing(secondaryCallData);
                for (let j = 0; j < analysisResult.length; j++) {
                  analysisResult[j].id = "fun" + (k + 1) + "[" + analysisResult[j].id + "]"
                }
                let queryType = {
                  'id': "fun" + (k + 1),
                  "argument": methodname,  //这里写函数的方法名
                  "value": data[1][i][k],
                  "children": analysisResult
                }
                processResult.push(queryType)
              }
            } else {
              //不需要再次解析的数组结构
              if (data[3][i] != null) {
                let queryType = {
                  'id': data[3][i],
                  "argument": data[0][i],
                  "value": data[1][i],
                }
                processResult.push(queryType)
              }
              else {
                let queryType = {
                  'id': "var_" + (i + 1),
                  "argument": data[0][i],
                  "value": data[1][i],
                }
                processResult.push(queryType)
              }
            }
          }
          else if (data[1][i]._hex || data[0][i].indexOf("int") != -1) {
            if (data[3][i] != null) {
              let queryType = {
                'id': data[3][i],
                "argument": data[0][i],
                "value": [String(data[1][i])],
              }
              processResult.push(queryType)
            }
            else {
              let queryType = {
                'id': "var_" + (i + 1),
                "argument": data[0][i],
                "value": [String(data[1][i])],
              }
              processResult.push(queryType)
            }
          }
          else {
            if (data[3][i] != null) {
              let queryType = {
                'id': data[3][i],
                "argument": data[0][i],
                "value": data[1][i],
              }
              processResult.push(queryType)
            }
            else {
              let queryType = {
                'id': "var_" + (i + 1),
                "argument": data[0][i],
                "value": data[1][i],
              }
              processResult.push(queryType)
            }
          }
        }
        return processResult
      } catch (error) { }
    },
    //解析
    async inquire() {
      let searchResult = await this.$options.methods.analyze(this.result, this.choose);
      this.data = await this.$options.methods.queryResultProcessing(searchResult);
      if (this.data == undefined) {
        this.$message.error("查询失败，请检查你的输入后重试");
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
.transactionData {
  width: 100%;
  height: 100%;
}

.scroll {
  width: 100%;
  height: calc(93vh - 70px);
  display: flex;
  justify-content: center;
  overflow: auto;
}

.result {
  width: 100%;
  margin: 1px 10px;
  width: 680px;
  word-wrap: break-word;
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

.stateCopy {
  width: 15px;
  height: 15px;
  margin-left: 10px;
  cursor: pointer;
}

.container .tips {
  font-size: 14px;
  color: #000;
  font-weight: 700;
  align-self: flex-start;
  margin-bottom: 10px;
}

.tips {
  margin-bottom: 20px;
}

.el-menu-demo {
  margin-bottom: 10px
}

.el-textarea {
  margin-bottom: 20px;
}

.container .el-input,
.container .el-textarea {
  width: 100%;
  margin-bottom: 30px;
}

.container .el-select {
  width: 100%;
  margin-bottom: 15px;
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

.analyze {
  margin-left: 41%;
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
  margin-bottom: 15px;
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

.el-table_cell {
  white-space: pre-wrap;
}

/deep/ .success-row {
  background: #efefef;
}

.analysisResult {
  width: 721px;
  height: auto;
}

.header li {
  display: inline-block;
  border: #EBEEF5 solid 1px;
  line-height: 48px;
  font-size: 15px;
  font-weight: 600;
  color: #909399;
  padding-left: 14px;
}

.header .header-number {
  width: 151px;
  height: 48px;
}

.header .header-parameter {
  margin-left: -1px;
  width: 151px;
  height: 48px;
}

.header .header-value {
  margin-left: -1px;
  width: 421px;
  height: 48px;
}

.analysisResult .noData {
  margin-top: -1px;
  width: 721px;
  height: 48px;
  border: #EBEEF5 solid 1px;
  line-height: 48px;
  text-align: center;
  font-size: 15px;
  color: #909399;
}

.exhibit li {
  border: #EBEEF5 solid 1px;
  display: inline-block;
  color: #909399;
  margin-top: -1px;
  font-size: 14px;
  font-weight: 500;
  color: #979797;
  line-height: 48px;
  padding: 0 10px;
}

.exhibit .exhibit-number {
  width: 151px;
  height: auto;

}

.exhibit .exhibit-parameter {
  margin-left: -1px;
  width: 151px;
  height: auto;

}

.exhibit .exhibit-value {
  margin-left: -1px;
  width: 421px;
  height: auto;
}
</style>