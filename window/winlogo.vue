<script setup lang="ts">
    import { ref } from 'vue';
import { AppItem } from './manage.vue';

    interface ItemOpinion {
        icon: string,
        name: string,
        handle: Function
    };
    interface RecommendOpinion extends ItemOpinion{
        more?: string
    }

    const search = ref(''),
        prop = defineProps(['apps','recommend','profile']) as {
            apps: Array<ItemOpinion>,
            recommend: Array<RecommendOpinion>,
            profile: {name:string, photo:string}
        },
        message = defineEmits(['hide']),
        allapp = ref(false);

    function call(app:AppItem){
        if(app.before && app.before(app)) return;
        // else 
    }
</script>

<template>
    <div class="startup">
        <div class="search">
            <input type="text" class="searcher" v-model="search" placeholder="搜索应用、设置和文档">
        </div>
        <div class="apps">
            <h2>
                {{ allapp ? '所有应用' : '已固定'}}
                <button class="btn" @click="allapp = ! allapp">
                    {{ allapp ? '已固定' : '所有应用' }}
                </button>
            </h2>
            <div class="app-list" v-show="allapp">
                <div v-for="app of prop.apps" @click="message('hide');call(app);">
                    <img :src="app.icon">
                    <span>{{ app.name }}</span>
                </div>
            </div>
            <div class="app-list" v-show="!allapp">
                <div v-for="app of prop.recommend" @click="message('hide');call(app);">
                    <img :src="app.icon">
                    <span>{{ app.name }}</span>
                </div>
            </div>
            <div class="action">
                <div class="user">
                    <img :src="prop.profile.photo">
                    <span>{{ prop.profile.name }}</span>
                </div>
                <div class="power">
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .startup{
        @import '../public/icon.scss';
        margin: -1rem;
        transform: translateY(-1rem);
        background-color: rgba(242, 242, 242);
        padding: 2rem;
        border-radius: .5rem;
        overflow: hidden;
        position: relative;
        cursor: auto;

        $border: #e6e0e0;
        $bg: #f3f1f1;

        > .search{
            display: flex;
            height: 1rem;
            padding: 0.5rem;
            background-color: white;
            border-radius: 2rem;
            border: solid 0.1rem $border;
            
            &::before{
                content: $icon_search;
                margin: 0 .75rem;
                width: 1rem;
                height: 1rem;
            }

            > input{
                flex-grow: 1;
                border: none;
                outline: none;
                font-size: .9rem;
                padding: 0;
                line-height: 1rem;
                background-color: transparent;
                color: #585555;
            }
        }

        .apps{
            width: 28rem;
            margin: 1.5rem 0;
            min-height: 20rem;
            overflow-y: auto;

            > h2{
                padding: 0 1.5rem;
                font-size: .95rem;
                line-height: 1.5rem;
                position: sticky;
                top: 0;

                > .btn{
                    padding: .25rem .45rem;
                    font-size: .8rem;
                    line-height: 1rem;
                    border-radius: .25rem;
                    outline: none;
                    border: solid .1rem $border;
                    background-color: white;
                    cursor: pointer;
                    float: right;

                    &::after{
                        display: inline-block;
                        width: .7rem;
                        height: .7rem;

                        content: $icon_right;
                    }
                }
            }

            > .app-list{
                display: flex;
                color: #585050;

                > div{
                    width: 4rem;
                    padding: .75rem .3rem;
                    position: relative;
                    border-radius: .5rem;
                    transition: all ease-in-out .1s;

                    text-align: center;

                    > img{
                        width: 2rem;
                        height: 2rem;
                        display: inline-block;
                        border-radius: .25rem;
                    }

                    > span{
                        margin-top: .25rem;
                        display: block;

                        font-size: .75rem;
                        line-height: 1rem;
                        height: 2rem;
                    }

                    &:hover{
                        background-color: white;
                    }
                }
            }
        }

        .action{
            position: absolute;
            bottom: 0;
            left: 0;right: 0;
            padding: .55rem 2.5rem;
            height: 2rem;
            
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            background: rgb(233, 232, 232);
            border-top: .1rem solid rgb(193, 189, 189);

            > .user{
                border-radius: .25rem;
                display: flex;
                align-items: center;
                padding: .375rem .75rem;

                > img{
                    width: 1.6rem;
                    height: 1.6rem;
                    margin-right: .5rem;
                    border-radius: 1rem;
                    overflow: hidden;
                    display: inline-block;
                }

                > span{
                    font-size: .8rem;
                    font-weight: 500;
                    color: #403e3e;
                }

                &:hover{
                    background-color: $bg;
                }
            }
        }
    }
</style>