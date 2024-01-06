<script setup lang="ts">
    import { onMounted, onUnmounted, reactive, ref, setDevtoolsHook } from 'vue';

    // ==================== 文件（夹）管理器 =======================
    const { list } = defineProps({
            list: {
                required: true,
                type: Object
            }
        }) as {list: Array<FileOrDir>},
        select = reactive({
            enable: false,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            selected: []
        }),
        list_element = ref<Array<HTMLElement>>([]);

    export type FileOrDir = FileObject | DirectoryObject;
    interface FileObject{
        type: 'file',
        name: string,
        size: number,
        created: number,
        modified: number,
        attr:{
            readable: boolean,
            writeable: boolean,
            executable: boolean,
            owner: string
        },
        hidden: boolean,
        icon: (file:FileObject) => string | string,
        handle: (file:FileObject) => void
    }
    interface DirectoryObject{
        type: 'directory',
        name: string,
        created: number,
        hidden: boolean,
        icon?: string
    }

    const getIcon = (fd: FileOrDir) => 
        (typeof fd.icon == 'function')
            ? fd.icon(fd as FileObject)     // 函数型
            : fd.icon || (                  // 字符串
                fd.type == 'directory'      // 默认
                    ? '/image/folder.webp'
                    : 'image/file.webp'
            )

    //  ===================== 选择管理 ==================
    function mark_selected(){
        if(!list_element.value) return console.error('List not ready.');
        // 整理数据
        const minmax = (num1:number,num2:number) =>
                num1 > num2 ? [num2,num1] : [num1,num2],
            [xr1,xr2] = minmax(select.x1,select.x2),
            [yr1,yr2] = minmax(select.y1,select.y2),
            element = list_element.value;
        // 逐个判断
        for (let i = 0; i < element.length; i++) {
            const child = element[i] as HTMLElement;
            if(child.classList.contains('select')) continue;
            const y1 = child.offsetTop,
                y2 = child.offsetTop + child.offsetHeight,
                x1 = child.offsetLeft,
                x2 = child.offsetLeft + child.offsetWidth;
            // 完全选中
            if(
                !((x1>xr2 || xr1>x2) || (y1>yr2 || yr1>y2))
            ) node_select(child);
        }
    }

    function clear_selected(){
        const selected = select.selected as Array<HTMLElement>;
        for (let i = 0; i < selected.length; i++) 
            selected[i].classList.remove('selected');
        select.selected = [];
    }

    let timer:number;
    function init_select(ev:MouseEvent){

        if(list.length == 0 ) return;
        clear_selected()

        select.x1 = select.x2 = ev.offsetX,
        select.y1 = select.y2 = ev.offsetY,
        select.enable = true;

        const handle = function(ev:MouseEvent){
            ev.preventDefault(),ev.stopPropagation();
            select.x2 += ev.movementX,
            select.y2 += ev.movementY;
            // 自动滑动
            // if(timer) timer = clearInterval(timer);
            // timer = setInterval(() => {
            //     if( !list_element.value[0] ) timer = clearInterval(timer)
            //     let element = list_element.value[0].parentElement,
            //         box = element.getBoundingClientRect(),
            //         y = box.y,
            //         h = y + box.height,
            //         top = ev.clientY - y,
            //         bottom = h - top;
            //     if(top < 0) element.scrollTop += top * 3;
            //     else if(bottom < 0) element.scrollTop -= bottom * 3;
            //     else console.log('timer',y,bottom,top)
            // },250);
        }

        document.addEventListener('mousemove',handle),
        document.addEventListener('mouseup',
            () => {
                document.removeEventListener('mousemove',handle);
                select.enable = false;
                if( Math.abs(select.x2 - select.x1) < 10 && Math.abs(select.y2 - select.y1) < 10 )
                    return;
                if( timer ) clearInterval(timer);
                mark_selected();
            },
            { once: true });
        
    }

    function node_select(element:HTMLElement,only?:boolean){
        if(only) clear_selected();
        element.classList.add('selected');
        select.selected.push(element);
    }
    
</script>

<template>
    <div class="winui-list">
        <div class="list" @mousedown="init_select">
            <!-- 默认输出 -->
            <div v-if="list.length == 0">
                此文件夹为空
            </div>
            <!-- 列表 -->
            <template v-else v-for="fd of list">
                <div :type="fd.type" :hidden="fd.hidden"
                    ref="list_element" class="item" tabindex="2" 
                    @mousedown.stop @click="node_select($el,true);"
                >
                    <!-- 图标 -->
                    <img :src="getIcon(fd)" />
                    <!-- 名称 -->
                    <span>{{ fd.name }}</span>
                </div>
            </template>
            <!-- 信息栏 -->
            
            <div class="select" :style="{
                display: select.enable ? 'block' : 'none',
                left: Math.min(select.x1, select.x2) + 'px',
                top: Math.min(select.y1, select.y2) + 'px',
                width: Math.abs(select.x1 - select.x2) + 'px',
                height: Math.abs(select.y1 - select.y2) + 'px'
            }"></div>
        </div>
        <div class="info" v-show="select.selected.length != 0">
            选中 {{ select.selected.length }} 个项目
        </div>
    </div>
</template>

<style lang="scss">
    .winui-list{
        overflow-y: auto;
        scroll-behavior: smooth;
        --size: 6rem;
        --icon: 4.5rem;

        *::-webkit-scrollbar-button{
            display: none;
        }
    
        *::-webkit-scrollbar{
            border-radius: .25rem;
            width: .5rem;
            background-color: #c0e3e9;
        }

        *::-webkit-scrollbar-thumb{
            background-color: #7bb4da;
            border-radius: .25rem;
            width: .5rem;

            &:hover{
                background-color: #2490b1;
            }
        }

        .list{
            position: relative;
            $focus: #00b7ff40;
            $hover: #00b2ff29;
            $border: #00b2ff40;

            padding: .25rem;
            overflow: hidden;

            display: grid;
            grid-column-gap: 1em;
            grid-template-columns: repeat(auto-fill,6rem);
            justify-content: space-around;
            align-items: flex-start;

            position: relative;

            > div {
                border-radius: .2rem;
                border: solid .1rem transparent;
                padding: .45em 0;
                width: var(--size);
                font-size: .75em;
                font-weight: 400;
                margin: .25rem;

                > img{
                    display: block;
                    width: var(--icon);
                    height: 5rem;
                    margin: auto;
                    pointer-events: none;
                }
        
                > span{
                    text-align: center;
                    word-wrap: break-word;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    pointer-events: none;
                }

                &:hover > div{
                    opacity: 1;
                    z-index: 1;
                }

                &:hover{
                    background-color: $hover;
                }

                &:focus,&.selected{
                    background-color: $focus;
                    border-color: $border;
                }
            }

            > .select{
                position: absolute;
                display: none;
                border: solid .1rem rgba(55, 116, 230, 0.7);
                background-color: rgba(52, 118, 232, 0.3);
                z-index: 1;
            }
        }
        > .info{
            position: absolute;
            right: 0;
            bottom: 0;
            font-size: .85rem;
            background-color: #e9ddddb3;
            padding: 0.25rem 0.75rem;
            backdrop-filter: blur(0.25rem);
            border-left: solid 0.2rem #1726d285;
        }
    }

</style>