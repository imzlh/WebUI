<script setup lang="ts">
    import { ref } from 'vue';

    interface ItemOpinion {
        icon: string,
        name: string,
        handle: Function
    };
    interface RecommendOpinion extends ItemOpinion{
        more?: string
    }

    let search = ref(''),
        prop = defineProps(['apps','recommend','user']) as {
            apps: Array<ItemOpinion>,
            recommend: Array<RecommendOpinion>
        },
        message = defineEmits(['hide']);
</script>

<template>
    <div class="search">
        <input type="text" class="searcher" v-model="search">
    </div>
    <div class="recommend">
        <h2>
            已固定
            <button class="btn">
                所有应用
            </button>
        </h2>
        <div class="app-list">
            <div v-for="app of prop.apps" @click="message('hide');app.handle();">
                <img :src="app.icon">
                <span>{{ app.name }}</span>
            </div>
        </div>
        <div class="action">
            <div class="user">
                <img src="./widget.png" />
                <span>我是傻逼</span>
            </div>
            <div class="power">
                <div class="icon"></div>
                
            </div>
        </div>
    </div>
</template>