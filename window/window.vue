
<script setup lang="ts">
    import { Component, Ref, reactive } from 'vue';

    // 传参
    export interface WindowPreset {
        x: number,
        y: number,
        width: number,
        height: number,
        display: 'normal'|'max'|'hidden',
        head?: boolean,
        title?: string,
        name?: string,
        icon?: string,
        btns?: Record<string, {
            icon: string,
            name: string,
            desc?: string,
            handle: string,
            content?: string
        }>,
        src?: string
    }

    const {id ,preset ,active ,moveDiv }
        = defineProps(['content','id','preset','active','moveDiv']) as {
            content: Ref<Component>,
            id: string,
            preset: WindowPreset,
            active: Ref<boolean>,
            moveDiv?: string
        }, 
        state = reactive({
            moving: false,
            resize: 'auto'
        }), 
        message = defineEmits(['destroy','top','blur']);

    // 获取光标信息
    const eventInfo = (ev:MouseEvent) => new Object({
        l: ev.clientX - preset.x,  // 距离左侧位置
        t: ev.clientY - preset.y,  // 距离顶部的位置
        r: preset.x + preset.width - ev.clientX, // 距离右端的位置
        b: preset.y + preset.height - ev.clientY,// 距离底部的位置
        x: ev.clientX,  // 页面x轴位置(以左上角为原点)
        y: ev.clientY   // 页面y轴位置
    }) as {
        l:number,
        t:number,
        r:number,
        b:number,
        x:number,
        y:number,
    };

    // 改变窗口大小
    const chSize = (e:MouseEvent) => 
        /*if*/ ((e.target as HTMLElement).classList.contains(moveDiv || '__moveable_head')) 
            && (preset.display = preset.display == 'max' ? 'normal' : 'max')

    // 处理光标
    function resizeCheck(event:MouseEvent){
        let ev = eventInfo(event);
        if(preset.display != 'normal') return true;
        if(ev.b < 6 || ev.t < 6)        state.resize = 'row-resize';
        else if(ev.l < 6 || ev.r < 6)   state.resize = 'col-resize';
        else state.resize = 'auto';

        return false;
    }

    // 调整大小、位置
    function handle(event:MouseEvent){
        let ev = eventInfo(event),element = event.target as HTMLElement;
        var moveHandle:(ev:MouseEvent) => any;

        if(ev.r < 6)        // 右侧拉伸
            moveHandle = ev => (preset.width += ev.movementX);
        else if(ev.l < 6)   // 左侧拉伸
            moveHandle = ev => (preset.width -= ev.movementX,preset.x += ev.movementX);
        else if(ev.b < 6)   // 下方拉伸
            moveHandle = ev => (preset.height += ev.movementY);
        else if(ev.t < 6)   // 上方拉伸
            moveHandle = ev => (preset.height -= ev.movementY,preset.y += ev.movementY);
        // 拖拽窗口
        else if(element.classList.contains(moveDiv || '__moveable_head')){
            // 最大化或太靠边时不能拖拽
            if(preset.display == 'max') return false;
            moveHandle = ev => (preset.x += ev.movementX,preset.y += ev.movementY,state.moving = true)
        }else return false;

        const end = function (e:MouseEvent) { 
            e.stopPropagation(); 
            e.preventDefault(); 
            moveHandle(e); 
        }
        document.addEventListener('mousemove',end);
        dosth = () => {
            state.moving = false,state.resize = 'auto';
            document.removeEventListener('mousemove',end);
        }
    }

    console.debug('WebUI Window created.');

</script>

<script lang="ts">

    const view = reactive({
        width: 0,
        height: 0,
        recommend: 0
    });

    window.addEventListener('resize',function(){
        view.width = this.document.documentElement.clientWidth,
        view.height = this.document.documentElement.clientHeight;
        let min = view.width > view.height ? view.height : view.width;
        view.recommend = 
            min > 400 ? 400 : min;
    });
    // 立即调用
    window.dispatchEvent(new Event('resize'));

    // 用于鼠标松开干一件事情，代替onmouseup
    var dosth:Function;
    document.addEventListener('mouseup',() => dosth && dosth());

</script>

<template>
    <div :style="
        {
            left: preset.x + 'px',
            top: preset.y + 'px',
            width: preset.width + 'px',
            height: preset.height + 'px',
            zIndex: active ? 2 : 1,
            minWidth: '160px',
            minHeight: '90px',
            cursor: state.resize
        }" 
        :data-id="id" :class="'app-' + (preset.name || 'default') + ' window'" 
        :data-active="active" :data-size="preset.display"
        @click="message('top');" 
        @mousedown.prevent="handle" @mousemove.prevent="resizeCheck" @dblclick.prevent="chSize"
    >
        <div class="action">
            <div v-if="preset.btns" v-for="btn of preset.btns" 
                :class="btn.name" @click="btn.handle" v-html="btn.content" :title="btn.desc">
            </div>
            <template v-else>
                <div @click="message('blur');preset.display = 'hidden';" class="min"></div>
                <div @click="chSize" class="resize" :data-size="preset.display"></div>
                <div @click="message('destroy');" class="close"></div>
            </template>
            
        </div>
        <iframe class="body" :src="preset.src" v-if="preset.src"></iframe>
        <div class="body" v-else>
            <div class="head __moveable_head" v-if="preset.title && preset.head"
                :style="{
                    cursor: state.moving ? 'move' : 'unset'
                }"
            > 
                <img :src="preset.icon" v-if="preset.icon">
                {{ preset.title || '无标题' }}
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss">
    @import './window.scss';

    .window{
        @include w_window();
    }
</style>