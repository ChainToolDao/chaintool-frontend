<template>
    <div>
        <div v-if='Array.isArray(data[1])'>
            <span v-if="Array.isArray(data[1][0])">[(
                <span v-for="i, index in data[1][0]">
                    <span v-if="data[1][0][index].toString().indexOf('0x') == -1 && judgmentValue(data[1][0][index]) ">
                        <span @click="matrixing(data[1][0][index])" style="color:#409EFF">{{
                            data[1][0][index]
                        }} <sub>10</sub></span>
                        <span>({{ Conversion(data[1][0][index]) }})<sub>16</sub></span>
                        <span v-if="index + 1 != data[1][0].length">, </span>
                    </span>
                    <span v-else>
                        {{ i }}
                        <span v-if="index + 1 != data[1][0].length"> , </span>
                    </span>
                </span>
                <span>)]</span>
            </span>
            <span v-else>
                <span v-if='!Array.isArray(data[0])'>
                    <span v-if="data[0].indexOf('[]') != -1">
                        <span>[</span>
                    </span>
                </span>
                <span v-for="i, index in data[1]">
                    <span v-if="data[1][index].toString().indexOf('0x') == -1 && judgmentValue(data[1][index])">
                        <span @click="matrixing(data[1][index])" style="color:#409EFF">{{ data[1][index]
                        }}</span>
                        <sub style="color:#409EFF">10</sub>
                        <span>({{ Conversion(data[1][index]) }}<sub>16</sub>)<span v-if="index + 1 != data[1].length">,
                                <br></span></span>
                    </span>
                    <span v-else>
                        {{ i }}
                        <span v-if="index + 1 != data[1].length"> , <br></span>
                    </span>
                </span>
                <span v-if='!Array.isArray(data[0])'>
                    <span v-if="data[0].indexOf('[]') != -1">]</span>
                </span>
            </span>
        </div>
        <span v-else=""> {{ data[1] }}</span>
    </div>
</template>


<script>
export default {
    props: {
        data: ''
    },
    methods: {
        // 跳转新窗口-单位转换
        matrixing(data) {
            let routeUrl = this.$router.resolve({
                name: "Unitconvert",
                query: { param: data }
            });
            window.open(routeUrl.href, '_blank');
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
        //判断数字值是否大于10000
        judgmentValue(intValue){
            console.log("进入判断的值")
            console.log(intValue)
            let numericValue
            if (intValue._hex) {
                numericValue = intValue._hex
            } else {
                numericValue =  parseInt(intValue)
            }
            if(numericValue>10000){
                return true
            }
            return false
        }
    }
};
</script>