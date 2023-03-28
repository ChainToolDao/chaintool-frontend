import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Unitconvert from '../views/UintConvert.vue'
import Abi from '../views/ABI.vue'
import Traceview from '../views/TraceView.vue'
import Bulkquery from '../views/BulkQuery.vue'
import Notfind from '../views/Notfind.vue'
import Address from '../views/Address.vue'
import QuerySelector from '../views/QuerySelector.vue'
import GenerateWallet from '../views/GenerateWallet.vue'
import ConvertTopicID from '../views/ConvertTopicID.vue'
import HashTool from '../views/HashTool.vue'
import CalldataDecode from '../views/CalldataDecode.vue'


Vue.use(Router)

const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/unitConvert',
            name: 'Unitconvert',
            component: Unitconvert
        },
        {
            path: '/unitConvert/:weiValue',
            name: 'Unitconvert',
            component: Unitconvert
        },
        {
            path: '/abi/:currencySymbol/:address',
            name: 'Abi',
            component: Abi
        },
        {
            path: '/abi',
            name: 'Abi',
            component: Abi
        },
        {
            path: '/traceview',
            name: 'Traceview',
            component: Traceview
        },
        {
            path: '/bulkQuery',
            name: 'Bulkquery',
            component: Bulkquery,
        },
        {
            path: '/address',
            name: 'AddresAndEMS',
            component: Address
        },
        {
            path: '/querySelector',
            name: 'QuerySelector',
            component: QuerySelector
        },
        {
            path: '/generateWallet',
            name: 'GenerateWallet',
            component: GenerateWallet
        },
        {
            path: '/topicID',
            name: 'ConvertTopicID',
            component: ConvertTopicID
        },
        {
            path: '/hashTool',
            name: 'HashTool',
            component: HashTool
        },
        {
            path: '/calldata',
            name: 'CalldataDecode',
            component: CalldataDecode
        },
        {
            path: '/*',
            name: 'Notfind',
            component: Notfind
        },
    ],
})