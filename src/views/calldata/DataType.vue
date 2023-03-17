<template>
    <div>
        <div v-if='Array.isArray(data)'>
            <span class="list-type">(</span>
            <span v-for=" i, index  in data" class="list-type">
                <span v-if="index == 0">{{ i }},</span>
                <div v-else-if="index != 0 && index + 1 != data.length">
                    {{ i }},
                </div>
                <span v-else-if="index + 1 == data.length">{{ i }}</span>
            </span>
            <span>)</span>
        </div>
        <span v-else=""> {{ data }}</span>
    </div>
</template>

<script>
export default {
    props: {
        data: ''
    },
};
</script>

<style scoped>
.list-type{
    line-height: 26px;
}
</style>