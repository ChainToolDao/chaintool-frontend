export default {
    //字符串数组解析
    async stringArrayParsing(string) {
        //对数组类型参数进行处理
        for (let i = 0; i < string.length; i++) {
            if(string[i]==undefined){
                string[i]=""
            }
            if (string[i].indexOf('[') == 0 && string[i].substr(-1) == "]") {
                if (string[i].substring(1, string[i].length - 1).indexOf('[') != -1) {
                    string[i] = eval(string[i])
                } else {
                    string[i] = string[i].substring(1, string[i].length - 1).split(',')
                }
            }
        }
        return string
    }
};
