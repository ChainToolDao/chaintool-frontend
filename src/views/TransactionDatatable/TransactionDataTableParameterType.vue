<template>
    <div>
        <div v-if='Array.isArray(data)'>
            <span style="line-height:25px">(</span>
            <span v-for=" i, index  in data" style="line-height: 26px;">
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