<script setup lang="ts">
    import { reactive, watch } from 'vue';

    /**
     * 这是一个使用WebUI Card实现的音乐播放器
     */
    export interface AudioItem{
        src: string,
        cover: string,
        name?: string
    }
    const playlist = reactive([] as Array<AudioItem>),
        now = reactive({
            playing: false,
            playable: false,
            id: -1,
            played: 0.0
        }),
        audio = new Audio();

    audio.onpause = () => now.playing = false;
    audio.onplay = () => now.playing = true;
    audio.onemptied = audio.onerror = () => now.playable = false;
    audio.oncanplay = () => now.playable = true;
    audio.ontimeupdate = () => now.played = audio.currentTime / audio.duration;

    function seekTime(ev:MouseEvent){
        audio.currentTime = ev.offsetX / (ev.currentTarget as HTMLElement).offsetWidth * audio.duration;
        audio.play();
    }

    watch(() => now.id,function(){
        if(now.id >= playlist.length) now.id = playlist.length -1;
        else if(now.id < 0) now.id = 0;
        else{
            audio.src = playlist[now.id].src;
            audio.play()
        }
    })

    defineExpose({
        playlist,
        audio,
        play(param:number|AudioItem){
            if(typeof param == 'number'){
                if(param >= playlist.length) return false;
                else now.id = param;
            }else{
                now.id = playlist.push(param) -1;
            }
        }
    });

</script>

<template>
    <div class="audio-player" @click.stop>
        <div class="left" :style="{
            backgroundImage: `url('${playlist[now.id]?.cover}')`
        }"></div>
        <div class="right">
            <span class="name">
                {{ playlist[now.id]?.name || '无标题' }}
            </span>
            <div class="action">
                <div class="last" @click="now.id --"></div>
                <div class="play" :data-play="now.playing" :data-state="now.playable"
                    @click="audio.paused?audio.play():audio.pause()"
                ></div>
                <div class="next" @click="now.id ++"></div>
            </div>
            <div class="seek" @click="seekTime"><div :style="{
                pointerEvents: now.playable ? 'all' : 'none',
                width: now.played * 100 + '%'
            }"></div></div>
        </div>
    </div>
</template>

<style lang="scss">
    @import '../public/input.scss';
    @import '../public/icon.scss';
    $width: 6em;    // 播放器高度

    .audio-player{

        display: flex !important;
        align-items: center;
        height: $width;
        > .left{
            width: $width;
            height: $width;
            flex-shrink: 0;
            border-radius: .5em;

            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('/image/cd.webp');
        }

        > .right{
            flex-grow: 1;
            padding-left: 1em;

            > span{
                font-size: .9rem;
                font-weight: 500;
                text-align: center;
                display: block;
            }

            > .action{
                display: flex;
                justify-content: center;
                height: 2em;
                gap: 3em;
                margin: 1em 0;

                .last{
                    content: $icon_back;
                }

                .play{
                    &[data-play=true]{
                        content: $icon_pause;
                    }

                    &[data-play=false]{
                        content: $icon_play;
                    }

                    &[data-state=false]{
                        opacity: .5;
                        pointer-events: none;
                    }
                }

                .next{
                    content: $icon_next;
                }
            }
            
            .seek{
                @include ui_input-range();
            }
        }
    }
</style>