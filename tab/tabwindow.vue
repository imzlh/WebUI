
<script setup lang="ts">
    import Vue,{ ref , Ref } from 'vue';

    export interface TabElement {
        title: string,
        close: boolean,
        motified: boolean,
        content?: Ref<Vue.Component>
    }

    const { icon,tabs } = defineProps(['tabs','icon']) as { tabs:Array<TabElement> ,icon:string },
        message = defineEmits(['create','change','close']),
        active = ref(0);
</script>

<template>
    <div class="wui_tab">
        <div class="tab __moveable_head" style="padding: .5rem 8rem 0 0 ;">
            <img class="icon" :src="icon">
            <div class="container">
                <template v-for="(tab,i) of tabs">
                    <div v-if="tab" class="tab" :data-active="i == active" :data-motified="tab.motified"
                        @click="message('change',() => active = i,tab);"
                    >
                        <span>{{ tab.title }}</span>
                        <div class="btn-close"
                            @click.prevent="message('close',() => (delete tabs[i]),tab);"
                        ></div>
                    </div>
                </template>
                
            </div>
            <div class="btn-create" @click="message('create',(tab:TabElement) => 
                active = tabs.push(tab) -1
            );"></div>
        </div>
        <slot name="before"></slot>
        <div class="tab-container">
            <template  v-for="(tab,id) of tabs" :key="id">
                <div v-if="tab" v-show="id == active" v-bind="$attrs">
                    <slot>
                        <component :is="tab.content" :data="tab"></component>
                    </slot>
                </div>
            </template>
        </div>
        <slot name="after"></slot>
    </div>
</template>

<style lang="scss">
    @import './tab.scss';

    .wui_tab{
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        > *{
            flex-shrink: 0;
        }

        .tab{
            @include w_tab();
        }

        .tab-container{
            flex-grow: 1;

            > *{
                overflow: auto;
                width: 100%;
                height: 100%;
            }
        }
    }
</style>