# 区块链开发工具-前端

本项目包含多个工具，帮助开发者在使用、开发区块链项目时提高效率

## 环境依赖以及所需软件
- Linux 
- Node.js v16^
- postgresql v14.1^


## 安装依赖
```
yarn install
```

## 部署

### 前端

#### 打包部署
````
yarn build
````

#### 本地启动
```
yarn serve
```

#### 后台服务
部分工具使用需要部署后台服务, 后台部署参考后台仓库[README](https://github.com/ChainToolDao/chaintool-server/blob/main/README.md)

#### 前端接口配置
根目录下新建.env配置文件

```
# 后端接口地址
VUE_APP_URL = https://xxx.xxx.xxx
```
