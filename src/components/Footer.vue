<template>
    <div class="footer">
        <div class="container">
            <div class="footer">© 2023 Chaintool.tech &nbsp;&nbsp;<span v-if="this.$i18n.locale=='zh'">| &nbsp;&nbsp;<a href="https://beian.miit.gov.cn/">粤ICP备17140514号-4</a></span></div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Footer',
}
</script>

<style scoped>
    .footer {
        width: 100%;
        display: flex;
        justify-content: center;
        background-color: #fff;
        font-size: 13px;
        cursor:default
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
      
    }
    a{
        text-decoration-line: none; 
        color: rgb(161, 161, 161);
    }
    a:hover{
        cursor: pointer;
        text-decoration:underline
    }

 
</style>
