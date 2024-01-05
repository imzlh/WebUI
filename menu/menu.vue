<script setup lang="ts">
import { Ref } from 'vue';


    interface HotKey{
        global: boolean,
        key: string,
        shift: boolean
    }

    export interface MenuItem {
        child?: Array<{
            text: string,
            keyboard: HotKey,
            icon?: string,
            handle?: Function,
            disabled?: Ref<boolean>
        }>,
        title: string,
        tip?: string,
        keyboard?: HotKey
    }

    const prop = defineProps(['item']) as {item:Array<MenuItem>};
</script>

<template>
    <div class="wui_menu" style="border-bottom: solid .1rem lightgray;">
        <div tabindex="1" v-for="item of prop.item" onclick="this.focus()">
            <span>{{ item.title }}</span>
            <!-- 主内容 -->
            <div class="container" v-if="item.child">
                <div v-for="child of item.child" :data-disabled="child.disabled"
                    @click="child.handle" 
                >
                    <img v-if="child.icon" class="icon" :src="child.icon">
                    <div v-else class="icon"></div>
                    <div class="text">{{ child.text }}</div>
                    <div class="keyboard" v-if="child.keyboard">
                        {{ child.keyboard.global ? 'Ctrl+' : '' }}
                        {{ child.keyboard.key.toUpperCase() }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    @import './menu.scss';

    .wui_menu{
        @include w_menu();
    }
</style>