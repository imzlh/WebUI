<script setup lang="ts">
    import { markRaw, onMounted, reactive, ref, shallowRef } from 'vue';
    import GroupWindow, { MessageOpinion, WindowParam } from './window/manage.vue';
    import Notepad from './test/notepad.vue';
    import Explorer from './list/explorer.vue';

    const test = ref('114514'),
        window = reactive([
            {
                "name":"notepad",
                "title":test,
                "icon":"/image/notepad.webp",
                "head": false,
                "x":300,
                "y":100,
                "width":600,
                "height":450,
                "content": markRaw(Notepad),
                "display": 'normal'
            }
        ]),main = ref(null),user = reactive({
            profile: {
                name: 'iz',
                photo: '/image/account.webp'
            },app:{
                fixed:[
                    {
                        name: '今日WebUI',
                        icon: '/image/icon.webp'
                    }
                ],recommend:[
                    {
                        name: '记事本',
                        icon: '/image/notepad.webp',
                        before: () => window.push({
                            "name":"notepad",
                            "title":'记事本',
                            "icon":"/image/notepad.webp",
                            "head": false,
                            "x":Math.random() * 300,
                            "y": Math.random() * 400,
                            "width":Math.random() * 300 + 400,
                            "height":Math.random() * 200 + 300,
                            "content": markRaw(Notepad),
                            "display": 'normal'
                        })
                    },{
                        name: '弹出？弹出！',
                        icon: '/image/icon.webp',
                        before: () => main.value.message({
                            icon: '/image/icon.webp',
                            title: 'WebUI',
                            content:{
                                title: '欢迎来到WebUI',
                                content: 'WebUI官网:webui.imzlh.top'
                            }
                        } as MessageOpinion)
                    },{
                        name: '文件资源管理器',
                        icon: '/image/explorer.webp',
                        before: () => window.push({
                            "name":"explorer",
                            "title":'文件资源管理器',
                            "icon":"/image/explorer.webp",
                            "head": true,
                            "x":Math.random() * 300,
                            "y": Math.random() * 400,
                            "width":Math.random() * 300 + 400,
                            "height":Math.random() * 200 + 300,
                            "content": markRaw(Explorer),
                            "display": 'normal'
                        })
                    }
                ]
            }
        });
    globalThis.windows = window;

    console.log(GroupWindow)

    document.dispatchEvent(new Event(''));

    onMounted(function(){
        main.value.audio.play({
            src: 'http://music.163.com/song/media/outer/url?id=1964336330.mp3',
            cover: 'http://p2.music.126.net/MxRs1mmwuykpmiPZlHA3ow==/109951167667879409.jpg?param=300x300',
            name: '仙剑鸡侠传 - 金色传说'
        });
    })
</script>

<template>
    <GroupWindow :window="window" :user="user" ref="main" />
</template>