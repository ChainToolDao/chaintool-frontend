import axios from 'axios'
import intefUrl from "./interface";

export default {
    //提交函数签名
    async submitFunctionSelector(functionName, functionSelector) {
        try {
            axios
                .post(intefUrl.selector, {
                    "signature": functionName,
                    "selector": functionSelector,
                })
                .then((res) => { 
                });
        } catch (error) {
        }
    },

    //获取函数签名
    async getFunctionSignature(functionSelector) {
        let signatureData = [];
        try {
            await axios
                .get(intefUrl.selector + "/" + functionSelector)
                .then((res) => {
                    for (let i in res.data.data) {
                        if (signatureData.indexOf(res.data.data[i]) == -1) {
                            signatureData.push(res.data.data[i]);
                        }
                    }
                });
        } catch (error) {
        }
        functionSelector = functionSelector.slice(2);
        try {
            await axios
                .get(
                    "https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/" +
                    functionSelector
                )
                .then((res) => {
                    let data = res.data.split(";");
                    for (let i in data) {
                        if (signatureData.indexOf(data[i]) == -1) {
                            signatureData.push(data[i]);
                            this.submitFunctionSelector(data[i], ("0x" + functionSelector))
                        }
                    }
                });
        } catch (error) {
        }
        return signatureData
    }
};
