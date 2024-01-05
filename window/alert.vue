<script setup lang="ts">
    import Window, {WindowPreset} from './window.vue';

    export interface AlertBoxOpinion{
        title: string,
        icon: string,
        content: string,
        width?: number,
        height?: number
        btns: Array<{
            value: string,
            disable: boolean,
            content: string
        }>
    }

    const { parent, active, meta } = defineProps(['parent','id','meta']) as {
        parent: WindowPreset,
        meta: AlertBoxOpinion,
        active: boolean
    },preset:WindowPreset = {
        x: parent.x + parent.width/2 - (meta.width || 200) ,
        y: parent.y + parent.height/2 - (meta.height || 120),
        width: (meta.width || 200),
        height: (meta.height || 120)
    }
</script>

<template>
    <Window :active="active" :preset="preset"></Window>
</template>