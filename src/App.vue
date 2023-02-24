<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>

export default {
    name: 'App',
}
</script>

<style>
    body {
        font-family: v-sans,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
        color: #404040;
        background-color: #F9FAFB;
    }
    li, ul, p, div, body, html, table {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    html, body {
        height: 100%;
    }
    li {
        list-style: none;
    }
    #app {
        height: 100%;
    }
</style>
