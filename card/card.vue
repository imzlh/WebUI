<script setup lang="ts">
    import { ref } from 'vue';

    const prop = defineProps({
        'icon': {
            type: String,
            required: false
        }, 'title': {
            required: true
        }, 'header':{
            type: Boolean,
            required: false,
            default: true 
        }, 'footer':{
            type: Boolean,
            required: false,
            defaults: false
        }, 'class':{
            type:String,
            required: false
        }
    }),show_ctx = ref(true);
</script>

<template>
    <div :class="'wui_card '+(prop.class || '')">
        <header v-if="prop.header">
            <img v-if="prop.icon" class="icon" :src="prop.icon">
            <div class="title">{{ prop.title }}</div>
            <div class="fold" @click="show_ctx = !show_ctx" :style="{
                transform: (show_ctx ?'rotate(180deg)' :undefined)
            }"></div>
        </header>
        <div class="content" v-show="show_ctx">
            <slot></slot>
        </div>
        <header v-if="prop.footer">
            <slot name="after"></slot>
        </header>
    </div>
</template>

<style lang="scss">
    @import './card.scss';

    .wui_card{
        @include ui_card();
    }
</style>