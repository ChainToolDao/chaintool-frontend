<template>
    <div>
        <div v-if='Array.isArray(data.value)'>
            <span v-if="Array.isArray(data.value[0])">[(
                <span v-for="i, index in data.value[0]">
                    <span v-if="data.value[0][index].toString().indexOf('0x') == -1 && judgmentValue(data.value[0][index])">
                        <span @click="matrixing(data.value[0][index])" style="color:#409EFF">{{
                            data.value[0][index]
                        }} <sub>10</sub></span>
                        <span>({{ Conversion(data.value[0][index]) }})<sub>16</sub></span>
                        <span v-if="index + 1 != data.value[0].length">, </span>
                    </span>
                    <span v-else>
                        {{ i }}
                        <span v-if="index + 1 != data.value[0].length"> , </span>
                    </span>
                </span>
                <span>)]</span>
            </span>
            <span v-else>
                <span v-if='!Array.isArray(data.argument)'>
                    <span v-if="data.argument.indexOf('[]') != -1">
                        <span>[</span>
                    </span>
                </span>
                <span v-for="i, index in data.value">
                    <span v-if="data.value[index].toString().indexOf('0x') == -1 && judgmentValue(data.value[index])">
                        <span @click="matrixing(data.value[index])" style="color:#409EFF">{{ data.value[index]
                        }}</span>
                        <sub style="color:#409EFF">10</sub>
                        <span>({{ Conversion(data.value[index]) }}<sub>16</sub>)<span v-if="index + 1 != data.value.length">,
                                <br></span></span>
                    </span>
                    <span v-else>
                        {{ i }}
                        <span v-if="index + 1 != data.value.length"> , <br></span>
                    </span>
                </span>
                <span v-if='!Array.isArray(data.argument)'>
                    <span v-if="data.argument.indexOf('[]') != -1">]</span>
                </span>
            </span>
        </div>
        <span v-else=""> {{ data.value }}</span>
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
        judgmentValue(intValue) {
            let numericValue
            if (intValue._hex) {
                numericValue = intValue._hex
            } else {
                numericValue = parseInt(intValue)
            }
            if (numericValue > 10000) {
                return true
            }
            return false
        }
    }
};
</script>