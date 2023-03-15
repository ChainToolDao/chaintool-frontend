<template>
    <div>
        <div class="mainRow"> Input Calldata</div>
        <el-input v-model="calldata" placeholder="Enter Calldata" @input="getFunctionSignAuto()" type="textarea"
            autosize></el-input>
        <div class="mainRow">选择函数 <span> <el-radio-group v-model="isManualInput" @click="selectInputWay">
                    <el-radio :label="false" border size="medium" @change="selectInputWay">自动选择</el-radio>
                    <el-radio :label="true" border size="medium" @change="selectInputWay">手动输入</el-radio>
                </el-radio-group></span>
        </div>
        <el-select v-model="chooseSignature" placeholder="Please Choose" v-if="!isManualInput">
            <el-option v-for="(item, index) in signatureArray" :key="'chainlist' + index" :label="item" :value="item">
            </el-option>
        </el-select>
        <el-input v-model="chooseSignature" placeholder="Input Function " v-if="isManualInput"></el-input>
        <div class="bottomButton contentButton" @click="decoding">解码
        </div>
        <div class="mainRow">解码结果</div>
        <el-table :data="decodingResult" style="width: 100%; " row-key="id" border :row-class-name="increaseTableStyle"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <el-table-column prop="id" label="参数" width="150">
            </el-table-column>
            <el-table-column label="参数类型" width="150">
                <template slot-scope="scope">
                    <DataType :data=scope.row.argument></DataType>
                </template>
            </el-table-column>
            <el-table-column label="值" width="420">
                <template slot-scope="scope">
                    <DataValue :data=scope.row></DataValue>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { ethers } from "ethers";
import DataValue from "./DataValue.vue";
import DataType from "./DataType.vue";
export default {
    components: {
        DataValue,
        DataType,
    },

    data() {
        return {
            // 输入的calldata
            calldata: "0x23b872dd0000000000000000000000008ba1f109551bd432803012645ac136ddd64dba72000000000000000000000000ab7c8803962c0f2f5bbbe3fa8bf41cd82aa1923c0000000000000000000000000000000000000000000000000de0b6b3a7640000",
            // 选择的签名
            chooseSignature: "transferFrom(address,address,uint256)",
            // 签名数组
            signatureArray: [],
            // 是手动输入
            isManualInput: false,
            // 解码结果
            decodingResult: [],
        };
    },

    methods: {
        //增加表格样式
        increaseTableStyle({ row, rowIndex }) {
            if (String(JSON.parse(JSON.stringify(row.id))).indexOf("[var") == "-1") {
                return 'success-row';
            }
            return '';
        },

        //选择输入方式
        selectInputWay: function () {
            if (this.isManualInput) {
                this.chooseSignature = ''
            } else {
                this.chooseSignature = this.signatureArray[0]
            }
        },

        //获取函数签名自动
        async getFunctionSignAuto() {
            let functionSignature = await this.functionSelector.getFunctionSignature(this.calldata.slice(0, 10))
            this.signatureArray = functionSignature
            if (!this.isManualInput) {
                this.chooseSignature = functionSignature[0]
            }
        },

        //  解析交易数据    
        async decodingTransactionData(ABIData, sign, funcGetFunctionSignature, funcSubmitFunctionSelector) {
            try {
                //判断是否存在函数签名，不存在则自动获取函数签名
                if (sign == undefined || sign == "") {
                    let functionSignature = await funcGetFunctionSignature(ABIData.slice(0, 10))
                    sign = functionSignature[0]
                } else {
                    funcSubmitFunctionSelector(sign, ABIData.slice(0, 10))
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
            } catch (error) {
            }
        },

        // 处理Calldata
        async processingCalldata(data, funcGetFunctionSignature, funcSubmitFunctionSelector) {
            try {
                let processResult = []
                for (let i = 0; i < data[1].length; i++) {
                    if (Array.isArray(data[1][i])) {
                        // multicall进行再次解析
                        if (data[2].indexOf("multicall(") != -1) {
                            for (let k = 0; k < data[1][i].length; k++) {
                                let secondaryCallData = await this.decodingTransactionData(data[1][i][k], '', funcGetFunctionSignature, funcSubmitFunctionSelector)
                                let methodname = secondaryCallData[2]
                                let analysisResult = await this.processingCalldata(secondaryCallData);
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
                        let queryTypeID = null
                        if (data[3][i] != null) {
                            queryTypeID = data[3][i]
                        } else {
                            queryTypeID = "var_" + (i + 1)
                        }
                        let queryType = {
                            'id': queryTypeID,
                            "argument": data[0][i],
                            "value": [String(data[1][i])],
                        }
                        processResult.push(queryType)
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

        //解码
        async decoding() {
            let searchResult = await this.$options.methods.decodingTransactionData(this.calldata, this.chooseSignature, this.functionSelector.getFunctionSignature, this.functionSelector.submitFunctionSelector);
            this.decodingResult = await this.$options.methods.processingCalldata(searchResult, this.functionSelector.getFunctionSignature, this.functionSelector.submitFunctionSelector);
            if (this.decodingResult == undefined) {
                this.$message.error("查询失败，请检查你的输入后重试");
            }
        },
    },
};
</script>

<style scoped>
.mainRow {
    margin-bottom: 20px;
}

.contentButton {
    margin-left: 41%;
}

/deep/ .el-select {
    width: 716px;
}

/deep/ .el-textarea {
    margin-bottom: 15px;
}

/deep/ .el-radio-group {
    margin-left: 10px;
}

/deep/ .el-input__inner {
    margin-bottom: 12px;
}
</style>