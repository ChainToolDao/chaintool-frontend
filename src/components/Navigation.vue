<template>
    <div class="navigation">
        <div class="container">
            <div class="btn" @click="toHome()">
                <span>
                    <img class="topLogo" src="../assets/imgs/topLogo.png" alt="">
                </span>
            </div>
            <div class="rightcontainer">
                <div>
                    <a href="https://github.com/ChainToolDao" target="_blank"> <img class="github" src="../assets/imgs/github.png" alt=""></a>
                    <a href="https://twitter.com/NUpchain" target="_blank"> <img class="twitter"
                            src="../assets/imgs/twitter.png" alt=""></a>
                </div>
                <div v-if="address" class="connect connected">
                    <div></div>

                    <div>{{ address }}</div>
                </div>


                <div v-else class="connect" @click="login">
                    <div></div>

                    <div>连接钱包</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ethers } from 'ethers'
import Proxy from '../proxy.js'

export default {
    name: 'Navigation',
    data() {
        return {
            address: null,
        }
    },

    computed: {
        account() {
            return this.$store.state.account
        },
    },

    async created() {
        if (this.account) {
            this.address = this.formatAccount(this.account)
        }
    },

    methods: {
        login() {
            Proxy.initWeb3Account(async (web3Provider) => {
                if (web3Provider) {
                    web3Provider.on('accountsChanged', (accounts) => {
                        if (accounts[0]) {
                            this.address = this.formatAccount(accounts[0])
                            this.$store.commit('updataAccount', accounts[0])
                        } else {
                            this.address = null
                            this.$store.commit('updataAccount', null)
                        }
                    })

                    let provider = new ethers.providers.Web3Provider(web3Provider)

                    let account = await provider.getSigner().getAddress()
                    this.$store.commit('updataAccount', account)
                    this.address = this.formatAccount(account)
                }
            })
        },

        formatAccount(acc) {
            let accLeft = acc.substring(0, 6)
            let accRight = acc.substr(-6)
            return `${accLeft}....${accRight}`
        },

        toHome() {
            this.$router.push('/')
        },
    },
}
</script>

<style scoped>
.navigation {
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.container {
    display: flex;
    width: 100%;
    height: 70px;
    max-width: 1280px;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    margin: 0 20px;
    cursor: pointer;
}

.container .btn {
    cursor: pointer;
}

.container div span {
    font-size: 24px;
    font-weight: 500;
}

.container .connect {
    height: 35px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 20px;
    background-color: #EEF0F3;
    border-radius: 5px;
}

.container .connect div:first-child {
    width: 16px;
    height: 16px;
    background-color: #A3A3A3;
    border-radius: 50%;
}

.container .connect div:last-child {
    font-size: 14px;
}

.container .connected div:first-child {
    background-color: #3EC93F;
}

.topLogo {
    width: 150px;
    height: 33px;
}

.github {
    width: 30px;
    height: 30px;
    margin-right: 12px;
    filter:invert(0%)
}

.twitter {
    width: 30px;
    height: 30px;
    margin-right: 12px;
    filter:invert(0%)
}

.rightcontainer {
    display: flex;  
    align-items: center
}
</style>
