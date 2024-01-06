<script setup lang="ts">
    import { reactive, shallowRef , ref } from 'vue';
    import TabWindow, { TabElement } from '../tab/tabwindow.vue';
    import NPContent from './content.vue';
    import Menu, { MenuItem } from '../menu/menu.vue';
    import { MessageOpinion } from '../window/manage.vue';

    const tab = reactive([] as Array<TabElement>),
        message = defineEmits(['destroy','message','top']),
        menu = [
            {
                title:'文件',
                child: [
                    {
                        text: '新建标签页',
                        keyboard: {
                            global: true,
                            key: 'n',
                            shift: false
                        },
                        handle: () => tab.push(createSession())
                    },{
                        text: '打开',
                        keyboard: {
                            global: true,
                            key: 'o',
                            shift: false
                        }
                    },{
                        text: '保存',
                        keyboard: {
                            global: true,
                            key: 's',
                            shift: false
                        }
                    },{
                        text: '全部保存',
                        keyboard: {
                            global: true,
                            key: 'n',
                            shift: true
                        }
                    },{
                        text: '页面设置'
                    },{
                        text: '退出',
                        handle: () => message('destroy')
                    }
                ]
            },{
                title: '编辑',
                child: [
                    // {
                    //     text: '撤销',
                    //     keyboard: {
                    //         global: true,
                    //         key: 'n',
                    //         shift: false
                    //     }
                    // },
                    {
                        text: '剪切',
                        keyboard: {
                            global: true,
                            key: 'n',
                            shift: true
                        },
                        handle: () => document.execCommand('cut')
                    },{
                        text: '复制',
                        keyboard: {
                            global: true,
                            key: 'n',
                            shift: true
                        },
                        handle: () => document.execCommand('copy')
                    },{
                        text: '粘贴',
                        keyboard: {
                            global: true,
                            key: 'n',
                            shift: true
                        },
                        handle: () => document.execCommand('paste')
                    },{
                        text: '查找',
                        keyboard: {
                            global: true,
                            key: 'n',
                            shift: true
                        }
                    },{
                        text: '替换',
                        keyboard: {
                            global: true,
                            key: 'n',
                            shift: true
                        }
                    },{
                        text: '转到',
                        keyboard: {
                            global: true,
                            key: 'n',
                            shift: true
                        }
                    }
                ]
            },{
                title: '更多',
                child: [
                    {
                        text: '关于',
                        handle: () => message('message',{
                            type: 'info',
                            content: {
                                content: '这是一个示例\n与Microsoft及其子公司没有任何关系',
                                title: 'WebUI Notepad'
                            },
                            handle: () => message('top')
                        } as MessageOpinion)
                    }
                ]
            }
        ] as Array<MenuItem>;

    function closeHandle(func:Function,tabnow:TabElement){
        if(tabnow.close) func();
        else if(confirm('确定要关闭吗')) func();
    }

    const createSession = () => reactive({
            title: '无标题.txt',
            close: true,
            motified: false,
            content: shallowRef(NPContent)
        } as TabElement);
</script>

<template>
    <TabWindow icon="/image/notepad.webp" :tabs="tab" style="overflow: hidden;"
        @change="c=>c()" @create="c=>c(createSession())" @close="closeHandle"
    >
        <template #before>
            <Menu :item="menu" />
        </template>
    </TabWindow>
</template>