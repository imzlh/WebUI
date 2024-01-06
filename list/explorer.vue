<script setup lang="ts">
    import { ref } from 'vue';
    import List, { FileOrDir } from './list.vue';

    let list = [] as Array<FileOrDir>;
    for (let i = 0; i < 28; i++) {
        list.push({
            type:'directory',
            name: 'test',
            created: 9999099,
            hidden: false
        });
    }
    list = ref(list);
</script>

<template>
    <List :list="list">

    </List>
</template>