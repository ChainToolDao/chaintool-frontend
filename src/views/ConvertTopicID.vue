<template>
  <div class="TopicIDView">
    <Navigation></Navigation>
    <div class="TopicID">
      <div class="container">
        <h3>事件签名获取TopicID</h3>
        <div>
          <h5>获取TopicID</h5>
          <div>
            <el-input
              v-model="inputEventSignature"
              placeholder="Input Event Signature"
            ></el-input>
            <el-button @click="obtainTopicID">确认获取</el-button>
          </div>
        </div>
        <h5 class="result">
          {{ outputTopicID
          }}<img
            class="stateCopy"
            v-if="stateCopyTopicID"
            src="../assets/imgs/copy.png"
            @click="copy(outputTopicID)"
          />
        </h5>

        <div>
          <h5>获取事件签名</h5>
          <div>
            <el-input
              v-model="inputTopicID"
              placeholder="Input Topic ID"
            ></el-input>
            <el-button @click="obtainEventSignature()">确认获取</el-button>
          </div>
        </div>
        <h5 class="result">
          {{ outputEventSignature }}
          <img
            src="../assets/imgs/copy.png"
            alt=""
            v-if="stateCopyEventSignature"
            class="stateCopy"
            @click="copy(outputEventSignature)"
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
import intefUrl from "../interface";
import { ethers } from "ethers";
import axios from "axios";
export default {
  name: "convertTopicID",
  components: {
    Navigation,
  },
  metaInfo() {
    return {
      title: "Chaintool - 事件签名获取TopicID",

      meta: [
        {
          name: "keyword",
          content: "事件签名获取TopicID,TopicID获取事件签名",
        },
      ],
    };
  },
  data() {
    return {
      inputEventSignature: "",
      outputTopicID: "",
      stateCopyTopicID: false,
      inputTopicID: "",
      outputEventSignature: "",
      stateCopyEventSignature: false,
      load: false,
    };
  },
  methods: {
    formatSignature(signature) {
      signature.split(")");
      signature = signature.replace(/^\s*/g, "");
      if (signature.indexOf("event ") == 0) {
        signature = signature.slice(5).replace(/^\s*/g, "");
      }
      let signatureStorage = "";
      //提取名字
      signatureStorage = signature.split(" ")[0].split("(")[0];
      //第一种情况，括号内没有内容
      if (
        signature.replace(/\s/g, "").indexOf("(") ==
        signature.replace(/\s/g, "").indexOf(")") - 1
      ) {
        return signatureStorage + "()";
      }
      //第二种情况，括号内有内容
      let processValue = signature.split("(")[1].split(")")[0].split(",");
      for (let i in processValue) {
        processValue[i] = processValue[i].replace(/^\s*/g, "").split(" ")[0];
        if (i == 0) {
          signatureStorage = signatureStorage + "(" + processValue[i];
        } else {
          signatureStorage = signatureStorage + "," + processValue[i];
        }
      }
      return signatureStorage + ")";
    },
    // 获取TopicID
    async obtainTopicID() {
      this.stateCopyTopicID = false;
      this.outputTopicID = "";
      this.inputEventSignature = this.inputEventSignature.replace(
        /(^\s*)/g,
        ""
      );
      let inputEventSignature = [this.inputEventSignature];
      //1.不输入括号时跳出 2.当用户输入的函数括号后面还有内容时，直接跳出
      if (inputEventSignature[0].split(")").length < 2) {
        this.outputTopicID =
          "输入错误，输入示例：event Transfer(address indexed from, address indexed to, uint256 amount)";
        return;
      }
      if (inputEventSignature[0].split(")")[1].length > 0) {
        this.outputTopicID =
          "输入错误，输入示例：event Transfer(address indexed from, address indexed to, uint256 amount)";
        return;
      }
      if (inputEventSignature[0].indexOf("event ") != 0) {
        inputEventSignature[0] = "event " + inputEventSignature[0];
      }
      try {
        let iface = new ethers.utils.Interface(inputEventSignature);
        inputEventSignature[0] = inputEventSignature[0].slice(6);
        let outputTopicID = iface.getEventTopic(inputEventSignature[0]);
        this.outputTopicID = outputTopicID;
        this.stateCopyTopicID = true;
        //执行数据库添加操作
        try {
          inputEventSignature[0] = this.$options.methods.formatSignature(
            inputEventSignature[0]
          );
          axios
            .post(intefUrl.topic, {
              topic: outputTopicID,
              signature: inputEventSignature[0],
            })
            .then((res) => {});
        } catch (error) {}
      } catch (error) {
        this.outputTopicID =
          "输入错误，输入示例：event Transfer(address indexed from, address indexed to, uint256 amount)";
      }
    },

    //获取事件签名
    async obtainEventSignature() {
      this.load = true;
      this.outputEventSignature = "正在查询";
      let inputTopicID = this.inputTopicID;
      this.stateCopyEventSignature = false;
      inputTopicID = inputTopicID.replace(/(^\s*)/g, "");
      let outputEventSignature = [];
      if (inputTopicID.indexOf("0x") != 0) {
        inputTopicID = "0x" + inputTopicID;
      }
      //  执行网络查找
      try {
        await axios
          .get(
            "https://www.4byte.directory/api/v1/event-signatures/?hex_signature=" +
              this.inputTopicID
          )
          .then((res) => {
            for (let i in res.data.results) {
              res.data.results[i].text_signature =
                this.$options.methods.formatSignature(
                  res.data.results[i].text_signature
                );
              outputEventSignature.push(res.data.results[i].text_signature);
            }
            if (outputEventSignature.length >= 50) {
              outputEventSignature = [];
            }
          });
      } catch (error) {}
      //执行数据库查找操作
      try {
        await axios
          .get(intefUrl.topic + "/" + this.inputTopicID)
          .then((res) => {
            for (let i in res.data.data) {
              res.data.data[i] = this.$options.methods.formatSignature(
                res.data.data[i]
              );
            }
            //数据库中没有的添加到数据库中
            for (let i in outputEventSignature) {
              if (!res.data.data.includes(outputEventSignature[i])) {
                try {
                  axios
                    .post(intefUrl.topic, {
                      topic: inputTopicID,
                      signature: outputEventSignature[i],
                    })
                    .then((res) => {});
                } catch (error) {}
              }
            }
            //数组中未被记录的添加到数组中
            for (let i in res.data.data) {
              if (!outputEventSignature.includes(res.data.data[i])) {
                //添加到数组
                outputEventSignature.push(res.data.data[i]);
              }
            }
          });
      } catch (error) {}
      for (let i in outputEventSignature) {
        if (i == 0) {
          this.stateCopyEventSignature = true;
          this.outputEventSignature = outputEventSignature[i];
        } else {
          this.outputEventSignature =
            this.outputEventSignature + ";" + outputEventSignature[i];
        }
      }

      if (outputEventSignature.length == 0) {
        this.outputEventSignature =
          "暂未查询到对应的事件签名。输入示例：0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
      }
      this.load = false;
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
.TopicIDView {
  width: 100%;
  height: 100%;
}
.TopicID {
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
