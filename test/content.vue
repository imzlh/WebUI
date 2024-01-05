
<script setup lang="ts">
    import { TabElement } from '../tab/tabwindow.vue';

    const { data } = defineProps(['data']) as { data: TabElement };
</script>

<template>
    <textarea class="text" placeholder="在此处编辑"
        @change="() => data.close = !(data.motified = true)" onclick="this.focus()"
    ></textarea>
</template>

<style lang="scss">
    .app-notepad{
        textarea{
            border: none;
            outline: none;
            padding: .2em;
            font-size: 1rem;
            width: 100%;height: 100%;
            box-sizing: border-box;
        }
    }
</style>