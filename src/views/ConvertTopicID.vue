<template>
  <div class="TopicIDView">
    <Navigation></Navigation>
    <div class="TopicID">
      <div class="container">
        <h3 class="title">{{$t('topicID.title')}}  </h3>
        <div class="usingHelp"><span><a href="https://github.com/ChainToolDao/chaintool-frontend/wiki/%E6%9F%A5%E8%AF%A2%E4%BA%8B%E4%BB%B6%E4%B8%BB%E9%A2%98(TopicID)"  target="_blank">{{$t('pubilc.usingHelp')}} <img src="../assets/imgs/explain.png" alt=""></a></span></div>
        <div>
          <h5>{{$t('topicID.EventSignature')}}</h5>
          <div class="unctionalArea">
            <el-input v-model="inputEventSignature" :placeholder="$t('topicID.inputEventSignature')"></el-input>
            <el-button @click="getTopicID">{{$t('pubilc.btnInquire')}}</el-button>
          </div>
        </div>
        <h5 class="result">
          {{ outputTopicID
          }}<img class="copyButton" v-if="canCopyTopicID" src="../assets/imgs/copy.png" @click="copy(outputTopicID)" />
        </h5>
        <div>
          <h5>{{$t('topicID.TopicID')}}</h5>
          <div class="unctionalArea">
            <el-input v-model="inputTopicID" :placeholder="$t('topicID.InputTopicID')"></el-input>
            <el-button @click="getEventSignature()">{{$t('pubilc.btnInquire')}}</el-button>
          </div>
        </div>
        <h5 class="result">
          {{ outputEventSignature }}
          <img src="../assets/imgs/copy.png" alt="" v-if="canCopyEventSignature" class="copyButton"
            @click="copy(outputEventSignature)" />
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
      title: "Chaintool - " + this.title,
      
      meta: [
        {
          name: "keyword",
          content: "根据事件名获取TopicID及TopicID获取事件签名",
        },
      ],
    };
  },
  data() {
    return {
      //输入事件签名
      inputEventSignature: "event Transfer(address indexed from, address indexed to, uint256 amount)",
      //输出TopicID
      outputTopicID: "",
      //可以复制TopicID
      canCopyTopicID: false,
      //输入TopicID
      inputTopicID: "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
      //输出事件签名
      outputEventSignature: "",
      //可以复制事件签名    
      canCopyEventSignature: false,
      //加载
      load: false,
    };
  },

  computed:{
    title(){
	    return this.$t("title.topicID")
	  }
  },

  methods: {
    //格式化事件名
    formatEventName(signature) {
      signature = signature.replace(/^\s*/g, "");
      if (signature.indexOf("event ") == 0) {
        signature = signature.slice(5).replace(/^\s*/g, "");
      }
      return signature;
    },

    // 获取TopicID
    async getTopicID() {
      this.canCopyTopicID = false;
      this.outputTopicID = "";
      this.inputEventSignature = this.inputEventSignature.replace(
        /(^\s*)/g,
        ""
      );
      let inputEventSignature = [this.inputEventSignature];
      //1.不输入括号时跳出 2.当用户输入的函数括号后面还有内容时，直接跳出
      if (inputEventSignature[0].split(")").length < 2) {
        this.outputTopicID = this.$t('topicID.signatureInputError');
        return;
      }
      if (inputEventSignature[0].split(")")[1].length > 0) {
        this.outputTopicID = this.$t('topicID.signatureInputError');
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
        this.canCopyTopicID = true;
        inputEventSignature[0] = this.$options.methods.formatEventName(
            inputEventSignature[0]
          );
        //执行数据库添加操作
        this.submitTopicID(outputTopicID,inputEventSignature[0]);
      } catch (error) {
        this.outputTopicID = this.$t('topicID.signatureInputError');
      }
    },

    //提交主题id
    async submitTopicID(topic,signature){
      try {
       axios
         .post(intefUrl.topic, {
           topic: topic,
           signature: signature,
         })
         .then((res) => { });
     } catch (error) { }
    },

    //事件签名查找（数据库查找+网络查找）
    async eventSignatureLookup(inputTopicID) {
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
                this.$options.methods.formatEventName(
                  res.data.results[i].text_signature
                );
              outputEventSignature.push(res.data.results[i].text_signature);
            }
            if (outputEventSignature.length >= 50) {
              outputEventSignature = [];
            }
          });
      } catch (error) { }
      //执行数据库查找操作
      try {
        await axios
          .get(intefUrl.topic + "/" + this.inputTopicID)
          .then((res) => {
            for (let i in res.data.data) {
              res.data.data[i] = this.$options.methods.formatEventName(
                res.data.data[i]
              );
            }
            //数据库中没有的添加到数据库中
            for (let i in outputEventSignature) {
              if (!res.data.data.includes(outputEventSignature[i])) {
                this.submitTopicID(inputTopicID,outputEventSignature[i])
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
      } catch (error) { }
      return outputEventSignature
    },

    //获取事件签名
    async getEventSignature() {
      this.load = true;
      this.outputEventSignature = this.$t('pubilc.querying');
      this.canCopyEventSignature = false;
      this.inputTopicID = this.inputTopicID.replace(/(^\s*)/g, "");
      let outputEventSignature = [];
      outputEventSignature = await this.eventSignatureLookup(this.inputTopicID);
      for (let i in outputEventSignature) {
        if (i == 0) {
          this.canCopyEventSignature = true;
          this.outputEventSignature = outputEventSignature[i];
        } else {
          this.outputEventSignature =
            this.outputEventSignature + ";" + outputEventSignature[i];
        }
      }
      if (outputEventSignature.length == 0) {
        this.outputEventSignature = this.$t('topicID.topicIDInputError');
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
        this.$message.success(this.$t('pubilc.copySauccessfully'));
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        this.$message.error(this.$t('pubilc.copyFailed'));
        clipboard.destroy();
      });
    },
  },
};
</script>

<style scoped>
.TopicIDView {
  width: 100%;
  height: auto;
  min-height: 94%;
}

.TopicID {
  width: 100%;
  height: auto;
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
  margin: 0 20px 30px 20px;
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

.container h5 {
  margin: 10px 0;
  font-size: 14px;
  color: #000;
  font-weight: 700;
}

.container .result {
  width: 100%;
  margin-left: 10px;
  word-break: break-all;
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

@media (max-width:768px){
    .container .result{
      word-break: break-all;
    }
    
    .container div .unctionalArea{
        flex-wrap: wrap;
    }

    .unctionalArea .el-button{
        margin-top: 20px;
    }
}
</style>
