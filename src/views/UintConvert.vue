<template>
    <div class="unitconvert">
        <Navigation></Navigation>

        <div class="scroll">
            <div class="container">
                <div class="title">{{$t("uintConvert.title")}} <span><a href="https://github.com/ChainToolDao/chaintool-frontend/wiki/%E4%BB%A5%E5%A4%AA-ETH-%E5%8D%95%E4%BD%8D%E8%BD%AC%E6%8D%A2%E5%99%A8"  target="_blank">{{$t("pubilc.usingHelp")}} <img src="../assets/imgs/explain.png" alt=""></a></span> </div>

                <div class="ether" v-for="(item, index) in ether_list" :key="'ether_list' + index">
                    <el-input :class="item.type" v-model="item.value" @input="inputValue(item.type, item.value)">
                        <template slot="prepend">{{ item.type }}</template>
                        <i slot="suffix" class="el-input__icon el-icon-document-copy" @click="copy(item.value)"></i>
                    </el-input>
                </div>

                <div class="tips">{{$t("uintConvert.describe")}}</div>
                <br />
                <div class="tips title">{{$t("uintConvert.illustrate[0]")}}</div>
                <div class="tips">{{$t("uintConvert.illustrate[1]")}}</div>
                <div class="tips">{{$t("uintConvert.illustrate[2]")}}</div>
            </div>
        </div>
    </div>
</template>


<script>
import { ethers } from 'ethers'
import Clipboard from 'clipboard'
import Navigation from '../components/Navigation.vue'
// eslint-disable-next-line
/* eslint-disable */
export default {
    name: 'unitconvert',
    components: {
        Navigation,
    },
    metaInfo() {
        return {
            title: "Chaintool - " + this.title,

            meta: [
                {
                    name: 'keyword',
                    content: '以太币单位转换,Ethereum Unit Converter,gwei转eth,Wei转Gwei,Wei转换成ETH,Ether单位换算,加密货币转换器'
                }
            ]
        }
    },
    data() {
        return {
            ether_list: [
                {
                    type: 'wei',
                    value: "1000000000000000000",
                },
                {
                    type: 'Kwei',
                    value: '1000000000000000',
                },
                {
                    type: 'Mwei',
                    value: '1000000000000',
                },
                {
                    type: 'Gwei',
                    value: '1000000000',
                },
                {
                    type: 'Szabo',
                    value: '1000000',
                },
                {
                    type: 'Finney',
                    value: '1000',
                },
                {
                    type: 'Ether',
                    value: '1',
                },
                {
                    type: 'Kether',
                    value: '0.001',
                },
                {
                    type: 'Mether',
                    value: '0.000001',
                },
                {
                    type: 'Gether',
                    value: '0.000000001',
                },
                {
                    type: 'Tether',
                    value: '0.000000000001',
                },
            ]
        }
    },

    computed:{
        title(){
	        return this.$t("title.unitConvert")
	    }
    },

    mounted(){
        if (this.$route.params.weiValue) {
            this.ether_list[0].value = this.$route.params.weiValue
            this.convertWei(this.$route.params.weiValue)
        }
    },

    methods: {
        inputValue(type, value) {
            if (!/^[+-]?(0|([1-9]\d*))(\.\d+)?$/.test(value)) {
                return
            }

            let weiAmount

            if (type == 'wei') {
                weiAmount = ethers.utils.parseUnits(value, 0)
            }

            if (type == 'Kwei') {
                weiAmount = ethers.utils.parseUnits(value, 3)
            }

            if (type == 'Mwei') {
                weiAmount = ethers.utils.parseUnits(value, 6)
            }

            if (type == 'Gwei') {
                weiAmount = ethers.utils.parseUnits(value, 9)
            }

            if (type == 'Szabo') {
                weiAmount = ethers.utils.parseUnits(value, 12)
            }

            if (type == 'Finney') {
                weiAmount = ethers.utils.parseUnits(value, 15)
            }

            if (type == 'Ether') {
                weiAmount = ethers.utils.parseUnits(value, 18)
            }

            if (type == 'Kether') {
                weiAmount = ethers.utils.parseUnits(value, 21)
            }

            if (type == 'Mether') {
                weiAmount = ethers.utils.parseUnits(value, 24)
            }

            if (type == 'Gether') {
                weiAmount = ethers.utils.parseUnits(value, 27)
            }

            if (type == 'Tether') {
                weiAmount = ethers.utils.parseUnits(value, 30)
            }

            this.convertWei(weiAmount)
        },

        copy(text) {
            const clipboard = new Clipboard('.el-input__icon', {
                text: () => {
                    return text
                }
            })

            clipboard.on('success', () => {
                this.$message.success(this.$t('pubilc.copySauccessfully'));
                clipboard.destroy()
            })

            clipboard.on('error', () => {
                this.$message.error(this.$t('pubilc.copyFailed')); 
                clipboard.destroy()
            })
        },

        deldempoint(str) {
            if (str.substr(-2, 2) == '.0') {
                return str.replace(".0", "")
            }
            else {
                return str
            }
        },

        convertWei(weiAmount) {
            this.ether_list.forEach(i => {
                if (i.type == 'wei') {
                    i.value = weiAmount.toString()
                }

                if (i.type == 'Kwei') {
                    i.value = this.deldempoint(ethers.utils.formatUnits(weiAmount, 3).toString())
                }

                if (i.type == 'Mwei') {
                    i.value = this.deldempoint(ethers.utils.formatUnits(weiAmount, 6).toString())
                }

                if (i.type == 'Gwei') {
                    i.value = this.deldempoint(ethers.utils.formatUnits(weiAmount, 9).toString())
                }

                if (i.type == 'Szabo') {
                    i.value = this.deldempoint(ethers.utils.formatUnits(weiAmount, 12).toString())
                }

                if (i.type == 'Finney') {
                    i.value = this.deldempoint(ethers.utils.formatUnits(weiAmount, 15).toString())
                }

                if (i.type == 'Ether') {
                    i.value = this.deldempoint(ethers.utils.formatUnits(weiAmount, 18).toString())
                }

                if (i.type == 'Kether') {
                    i.value = this.deldempoint(ethers.utils.formatUnits(weiAmount, 21).toString())
                }

                if (i.type == 'Mether') {
                    i.value = this.deldempoint(ethers.utils.formatUnits(weiAmount, 24).toString())
                }

                if (i.type == 'Gether') {
                    i.value = this.deldempoint(ethers.utils.formatUnits(weiAmount, 27).toString())
                }

                if (i.type == 'Tether') {
                    i.value = this.deldempoint(ethers.utils.formatUnits(weiAmount, 30).toString())
                }
            });
        },
    },
}
</script>

<style scoped>
.unitconvert {
    width: 100%;
    height: auto;
    min-height: 94%;
}

.scroll {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
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

.container .ether {
    width: 100%;
    height: 32px;
    margin-bottom: 24px;
}

/deep/ .el-input__inner {
    height: 32px;
    line-height: 32px;
}

/deep/ .el-input-group__prepend {
    width: 70px;
    padding: 0;
    text-align: right;
    padding-right: 10px;
    color: #515a6e;
}

.el-input__icon {
    line-height: 32px;
    cursor: pointer;
}

.container .tips {
    color: #a3a3a3;
    font-size: 14px;
    align-self: flex-start;
}

.container .tips.title {
    font-weight: 700;
    margin: 0;
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

@media (max-width: 808px) {
    .container {
        max-width: calc(100vw - 40px);
    }
}

@media (max-width:500px){
    .title span a {
        top: 25px;
        left: 50%;
        margin-left: 0;
    }
    .container .title{
        margin-bottom: 50px;
    }
}
</style>
