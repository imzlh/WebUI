<script setup lang="ts">
    import Vue,{ ref, defineProps, nextTick, Raw, watch } from 'vue';
    import Window from './window.vue';
    import Calendar from './calendar.vue';
    import listenPos from './posmanager';
    import { WindowPreset } from './window.vue';
    import AudioPlayer, { AudioItem } from './player.vue';
    import WindowsAction from './winlogo.vue';

    const { window ,widget ,message, user } = defineProps({
        'window':{
            type: Object,
            default: []
        },'widget':{
            type: Object,
            default: []
        },'message':{
            type: Object,
            default: []
        },'user':{
            type: Object,
            required: true
        }
    }) as {
            window: Array<WindowParam>,
            widget: Array<WidgetOpinion>,
            message: Array<MessageOpinion>,
            user: {
                profile: {
                    name: string,
                    photo: string,
                    uid: number
                },app:{
                    fixed:Array<AppItem>,
                    recommend:Array<AppItem>
                }
            }
        },
        window_active = ref(0),
        dateref = ref(new Date()),
        widget_active = ref(''),
        vAutoPosition = {
            mounted(dom:HTMLElement){
                listenPos(dom);
            }
    },audio = ref();

    // 自动补0
    function _2(num:number):string{
        if(num > 9)     return num.toString();
        else            return '0' + num.toString();
    }
    
    // 更新时间
    setTimeout(() => setInterval(() => {
        dateref.value = new Date();
    }, 1000),999 - dateref.value.getMilliseconds());

    // 单击小图标
    function callApp(app:WindowPreset,i:number){
        if(i == window_active.value){
            // 已经激活: 最小化
            app.display = 'hidden';
            window_active.value = -1;
        }else{
            // 没有显示:显示
            if(app.display = 'hidden')
                window_active.value = i,app.display = 'normal';
            else window_active.value = -1;
        }
    }

    // 消息组件
    function postMessage(msg:MessageOpinion,window?:WindowParam){
        if(window){
            if(!msg.icon) msg.icon = window.icon;
            if(!msg.title) msg.title = window.title;
        }
        const i = message.push(msg) -1;
        if(msg.timeout) setTimeout(() => delete message[i],msg.timeout * 1000);
    }
    function msg_destroy(i:number){
        message[i].hidden = true;
        nextTick(() => setTimeout( () => delete message[i] , 200));
    }

    // 自动激活组件
    const vActive = {
        element:{},
        beforeMount(element:HTMLElement,{value,modifiers}){
            if(modifiers.target){
                if(value in vActive.element)
                    console.warn('重复的定义:',value);
                vActive.element[value] = element;
            }else{
                element.onclick = () => widget_active.value = value;
            }
        }
    }
    watch(widget_active,(after,before) => {
        console.log(before,after)
        if(before && (before in vActive.element))
            delete vActive.element[before].dataset.active;
        if(!after) return;
        if(after in vActive.element)
            vActive.element[after].dataset.active = '';
        else console.warn('找不到激活的组件:',after);
    })

    export interface WindowParam extends WindowPreset {
        content: Vue.Component | Raw<Vue.Component>,
    }
    
    export interface WidgetOpinion{
        icon?: string,
        name: string,
        id: string,
        content?: Object,
        dialog?: Object,
        handle?: (ev:MouseEvent) => void,
        onopen?: (ev:MouseEvent) => void
    }

    export interface MessageOpinion{
        icon?: string,
        title?: string,
        body?: Vue.Component,
        content?: {
            content?: string,
            title: string
        },
        type?: 'warn'|'error'|'info'|'success',
        handle?: Function,
        hidden?: boolean,
        timeout?: number
    }

    export interface AppItem{
        icon: string,
        name: string,
        package: string,
        entry: string,
        before?: (app:AppItem) => boolean|undefined
    }

    defineExpose({
        audio,
        message: postMessage
    });

</script>

<template>
    <!-- 窗口管理 -->
    <template v-for="(item,i) of window">
        <Window v-if="item" :id="i.toString()" :preset="item" :content="item.content"
            :active="i == window_active"
            @destroy="() => {delete window[i]}" @top="window_active = i" @blur="window_active = 0;console.log(window_active)"
        >
            <component :is="item.content" 
                @destroy="() => {delete window[i]}" @top="window_active = i" @blur="window_active = 0;console.log(window_active)"
                @message="msg => postMessage(msg,item)"
                @play="(item:AudioItem) => audio.play(item)"
            ></component>
        </Window>
    </template>
    <div id="bar-mask" v-show="widget_active != ''" v-active="''"></div>

    <!-- 任务栏 -->
    <div class="taskbar">
        <!-- 左侧小组件 -->
        <div class="widget icon" tabindex="-1">
            <img src="/image/widget.webp">
        </div>
        <!-- 中间组件 -->
        <div class="containter" tabindex="">
            <!-- window标志 -->
            <div class="icon" v-active="'default.winlogo'" >
                <img src="/image/icon.webp">
            </div>
            <div class="dialog" v-active.target="'default.winlogo'">
                <WindowsAction :recommend="user.app.recommend" :apps="[]" :profile="user.profile"
                    @hide="widget_active = ''"
                ></WindowsAction>
            </div>
            <!-- 组件 -->
            <div v-for="item of widget" :class=" item.icon ? 'icon' : 'inline' " @click="item.handle">
                {{ item.content }}
                <div v-if="item.dialog" v-active.target="item.id" class="dialog" v-auto-position>
                    {{ item.dialog }}
                </div>
            </div>
            <!-- 窗口小图标 -->
            <template v-for="(app,i) of window">
                <div v-if="app" class="icon opened" :data-active="window_active == i" 
                    :data-name="app.title || 'default'" tabindex="-1"
                    @click="callApp(app,i)"
                >
                    <img :src="app.icon || './default.webp'">
                </div>
            </template>
        </div>
        <!-- 右侧小组件 -->
        <div class="right">
            <div class="date" data-action="calendar" 
                v-active="'default.calendar'" 
                style="background-color: transparent;"
            >
                <!-- 时间组件 -->
                <div>{{ _2(dateref.getHours()) }}:{{ _2(dateref.getMinutes()) }}:{{ _2(dateref.getSeconds()) }}</div>
                <div>{{ _2(dateref.getFullYear()) }}/{{ _2(dateref.getMonth()) }}/{{ _2(dateref.getDay()) }}</div>
                <div class="dialog messages">
                    <!-- 消息列表 -->
                    <template  v-for="(item,i) of message">
                        <div v-if="item" class="msg" :data-active="item.hidden ? null : ''" @click.stop>
                            <header v-if="item.title">
                                <img v-if="item.icon" :src="item.icon">
                                <span>{{ item.title }}</span>
                                <i class="close" @click="msg_destroy(i)"></i>
                            </header>
                            <template v-if="item.content">
                                <div class="body" :data-level="item.type">
                                    <h2>{{ item.content.title }}</h2>
                                    <span>{{ item.content.content }}</span>
                                </div>
                            </template>
                            <component v-else-if="item.body" 
                                :is="item.body"
                                :title="item.title" :icon="item.icon"
                                @click="item.handle" @destroy="delete message[i]"
                            ></component>
                        </div>
                    </template>

                    <!-- 内嵌音乐组件 -->
                    <AudioPlayer ref="audio" class="msg" data-active></AudioPlayer>

                    <!-- 日历 -->
                    <Calendar v-active.target="'default.calendar'"></Calendar>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    @import './taskbar.scss';
    @import '../public/icon.scss';

    .messages{
        // overflow: hidden;
        left: unset !important;
        right: 0 !important;
        transform: none !important;
        background-color: transparent !important;
        width: 20rem;

        .msg{
            background-color: rgba(219, 224, 236, .8);
            backdrop-filter: blur(1em);
            padding: 1.25em;
            border-radius: .5em;
            text-align: start;
            margin: 1em 0 !important;

            > header {
                display: flex;
                height: 1.5em;
                gap: .75em;
                line-height: 1.5em;
                margin: -.25em;
                color: #5c5e61;

                .close{
                    content: $icon_right;
                }

                span{
                    flex-grow: 1;
                }

                *{
                    flex-shrink: 0;
                }
            }

            > .body{
                &[data-level]{
                    padding-left: 6em;
                    position: relative;

                    &::before{
                        content: '';

                        background-image: url('/image/question.webp');
                        background-position: center;
                        background-repeat: no-repeat;
                        background-size: 100%;

                        position: absolute;
                        left: 0;
                        top: 0;
                        bottom: 0;
                        width: 5em;
                    }

                }
                &[data-level=info]::before{
                    background-image: url('/image/info.webp');
                }

                &[data-level=warn]::before{
                    background-image: url('/image/warning.webp');
                }

                &[data-level=error]::before{
                    background-image: url('/image/error.webp');
                }

                span{
                    line-height: 1.5em;
                }
            }
        }

        > div{
            transition: all 0.2s;

            &:not([data-active]){
                transform: translateX(120%);
                margin-bottom: -100%;
            }
        }
    }
</style>