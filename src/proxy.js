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
                    that.$t('connectWallet.walleAccessDenied')
                )
                return
            }
            callback(provider)
        } else {
            that.$message.error(
                that.$t('connectWallet.notInstalledMetaMask')
            )
        }
    },
}

