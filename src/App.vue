<template>
    <div id="app">
        <router-view />
        <Footer class="footer"></Footer>
    </div>
</template>

<script>
import Footer from './components/Footer.vue'
export default {
    name: 'App',
    components: {
        Footer,
    },
}
</script>

<style>
body {
    font-family: v-sans, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
    color: #404040;
    background-color: #F9FAFB;
}

li,
ul,
p,
div,
body,
html,
table {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html,
body {
    height: 100%;
}

li {
    list-style: none;
}

#app {
    height: 100%;
}
</style>
