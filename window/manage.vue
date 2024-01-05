<script setup lang="ts">
    import Vue,{ ref, defineProps, reactive, Raw } from 'vue';
    import Window from './window.vue';
    import Calendar from './calendar.vue';
    import listenPos from './posmanager';
    import { WindowPreset } from './window.vue';
    import AudioPlayer from './player.vue';

    const { window ,widget ,message } = defineProps({
        'window':{
            type: Object,
            default: []
        },'widget':{
            type: Object,
            default: []
        },'message':{
            type: Object,
            default: []
        }
    }) as {
            window: Array<WindowParam>,
            widget: Array<WidgetOpinion>,
            message: Array<MessageOpinion>
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
        console.log(i)
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
        hidden?: boolean
    }

    defineExpose({audio});

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
                @message="msg => {
                    if(!msg.icon) msg.icon = item.icon;
                    if(!msg.title) msg.title = item.title;
                    message.push(msg);
                }"
            ></component>
        </Window>
    </template>
    <div id="bar-mask" v-show="widget_active != ''" @click="widget_active = '';"></div>

    <!-- 任务栏 -->
    <div class="taskbar">
        <!-- 左侧小组件 -->
        <div class="widget icon" tabindex="-1">
            <img src="./image/widget.png">
        </div>
        <!-- 中间组件 -->
        <div class="containter" tabindex="">
            <!-- 组件 -->
            <div v-for="item of widget" :class=" item.icon ? 'icon' : 'inline' " @click="item.handle">
                {{ item.content }}
                <div v-if="item.dialog" v-show="widget_active == item.id" class="dialog" v-auto-position>
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
                @click="widget_active = 'default.calendar'" 
                style="background-color: transparent;"
            >
                <!-- 时间组件 -->
                <div>{{ _2(dateref.getHours()) }}:{{ _2(dateref.getMinutes()) }}:{{ _2(dateref.getSeconds()) }}</div>
                <div>{{ _2(dateref.getFullYear()) }}/{{ _2(dateref.getMonth()) }}/{{ _2(dateref.getDay()) }}</div>
                <div class="dialog"
                    style="left: unset;right: 0;transform: none;background-color: transparent;width: 20rem;"
                >
                    <!-- 消息列表 -->
                    <template  v-for="(item,i) of message">
                        <div v-if="item" class="message-card" @click.stop="">
                            <header v-if="item.title">
                                <img v-if="item.icon" :src="item.icon">
                                <span>{{ item.title }}</span>
                                <i class="close" @click="delete message[i]"></i>
                            </header>
                            <template v-if="item.content">
                                <div class="body" :data-level="item.type">
                                    <h2>{{ item.content.title }}</h2>
                                    <span>{{ item.content.content }}</span>
                                </div>
                            </template>
                            <component v-else-if="item.body" 
                                :is="item.body" v-show="item.hidden"
                                :title="item.title" :icon="item.icon"
                                @click="item.handle" @destroy="delete message[i]"
                            ></component>
                        </div>
                    </template>

                    <!-- 内嵌音乐组件 -->
                    <AudioPlayer ref="audio"></AudioPlayer>

                    <!-- 日历 -->
                    <div v-show="widget_active == 'default.calendar'">
                        <Calendar></Calendar>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    @import './taskbar.scss';
    @import '../public/icon.scss';

    .message-card{
        background-color: rgba(219, 224, 236, .8);
        backdrop-filter: blur(1em);
        padding: 1.25em;
        border-radius: .5em;
        text-align: start;
        margin: 1em 0;

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

                    background-image: url('/img/ui/question.png');
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
                background-image: url('./image/info.png');
            }

            &[data-level=warn]::before{
                background-image: url('./image/warning.png');
            }

            &[data-level=error]::before{
                background-image: url('./image/error.png');
            }

            span{
                line-height: 1.5em;
            }
        }
    }
</style>