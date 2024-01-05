<script setup lang="ts">
    import { markRaw, onMounted, reactive, ref, shallowRef } from 'vue';
    import GroupWindow, { MessageOpinion, WindowParam } from './window/manage.vue';
    import Notepad from './test/notepad.vue';

    const test = ref('114514'),
        window = reactive([
            {
                "name":"notepad",
                "title":test,
                "icon":"./notepad.png",
                "head": false,
                "x":300,
                "y":100,
                "width":600,
                "height":450,
                "content": markRaw(Notepad),
                "display": 'normal'
            },{
                "name":"notepad",
                "title":test,
                "icon":"./notepad.png",
                "head": false,
                "x":100,
                "y":300,
                "width":500,
                "height":300,
                "content": markRaw(Notepad),
                "display": 'normal'
            }
        ]),main = ref(null);
    globalThis.windows = window;

    // setInterval(function(){
    //     test.value = (Math.random()*100000).toFixed(0);
    // },114*5)
    console.log(GroupWindow)

    document.dispatchEvent(new Event(''));

    onMounted(function(){
        console.log(main)
        main.value.audio.play({
            src: 'http://music.163.com/song/media/outer/url?id=1964336330.mp3',
            cover: 'http://p2.music.126.net/MxRs1mmwuykpmiPZlHA3ow==/109951167667879409.jpg?param=300x300',
            name: '仙剑鸡侠传 - 金色传说'
        });
        console.log(main.value.audio)
    })
</script>

<template>
    <GroupWindow :window="window" ref="main" />
</template>