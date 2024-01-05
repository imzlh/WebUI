<script setup lang="ts">
    import { computed, ref } from 'vue';
    import Day from 'dayjs';
    import Card from '../card/card.vue';

    const today = ref(Day()),
        active = ref(today.value.date()),
        title = computed(() => `${today.value.month()+1}月${today.value.date()}日 星期${['日','一','二','三','四','五','六'][today.value.day()]} 
            \n${today.value.toDate().toLocaleString('zh-u-ca-chinese').split(' ')[0]}`);
    
</script>
<template>
    
    <Card :title="title" class="calendar">
        <div>日</div>
        <div>一</div>
        <div>二</div>
        <div>三</div>
        <div>四</div>
        <div>五</div>
        <div>六</div>
        <div v-for="() in today.startOf('month').day()"></div>
        <div v-for="i in today.endOf('month').date()" tabindex="-1" :key="i"
            @click="active = i;today = today.clone().date(i);" :class="(active == i ? 'active' : null) + ' im-date'">
            {{ i }}
        </div>
    </Card>

</template>
<style lang="scss">

    .calendar header{
        padding: 1em 1.5em;
    }

    .calendar .content{
        display: grid;
        grid-template-columns: repeat(7,3em);
        gap: .5em;
        border: solid .1em transparent;
        --main-color: rgb(75, 89, 186);
        padding: 1em;
        justify-content: center;

        cursor: auto;

        > div{
            border-radius: 2em;
            transition: all .2s;
            width: 3em;
            line-height: 3em;

            &.im-date:hover{
                background-color: rgb(215, 210, 210);
            }

            &.im-date:focus{
                border-color: var(--main-color);
            }

            &.active{
                background-color: var(--main-color) !important;
                color: white;
            }
        }
    }
</style>