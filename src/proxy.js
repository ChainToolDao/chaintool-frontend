/* eslint-disable */
import Vue from 'vue'


export default {

    async initWeb3Account(callback) {
        let provider
        if (window.ethereum) {
            provider = window.ethereum;
            try {
                await window.ethereum.enable();
            } catch (error) {
                callback(false)
                Message.error("连接失败, MetaMask连接被拒绝");
            }
            callback(provider)
        } else {
            Message.error("连接失败, 请先安装MetaMask");
        }
    },
}

