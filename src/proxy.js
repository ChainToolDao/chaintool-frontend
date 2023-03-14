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
                return "false1"
            }
            callback(provider)
        } else {
            return "false2"
        }
    },

}

