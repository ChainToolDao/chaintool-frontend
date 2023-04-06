/* eslint-disable */

export default {
    async initWeb3Account(callback,that) {
        let provider
        if (window.ethereum) {
            provider = window.ethereum;
            try {
                await window.ethereum.enable();
            } catch (error) {
                callback(false)
                that.$message.error(
                    '连接失败, MetaMask连接被拒绝。'
                )
                return
            }
            callback(provider)
        } else {
            that.$message.error(
                '连接失败, 请先安装MetaMask.'
            )
        }
    },
}

