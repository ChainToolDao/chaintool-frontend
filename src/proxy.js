/* eslint-disable */
import Vue from 'vue'
import { Message } from 'element-ui'

export default {

    async initWeb3Account(callback) {

        let provider
        if (window.ethereum) {
            provider = window.ethereum;

            try {
                await window.ethereum.enable();
            } catch (error) {
                Message.error("连接失败, MetaMask连接被拒绝");
                callback(false)
                return
            }
            callback(provider)
        } else {
            Message.error("连接失败, 请先安装MetaMask");
            return
        }
    },

}

