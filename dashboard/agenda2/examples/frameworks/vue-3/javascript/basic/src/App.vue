<!-- Application -->

<template>
    <bryntum-demo-header
        link="../../../../../#example-frameworks-vue-3-javascript-basic"
    />
    <div class="demo-toolbar align-right">
        <div class="active-view">
            <label>Active view:</label> {{ capitalize(mode) }}
        </div>
        <bryntum-button
            cls="b-deep-orange b-raised"
            text="Next View Mode"
            :mode="mode"
            @click="onButtonClick"
        />
    </div>
    <bryntum-calendar
        ref="calendar"
        v-bind="calendarConfig"
        :onActiveItemChange="onActiveItemChange"
        :mode="mode"
    />
</template>

<script>
// vue imports
import { ref, reactive, computed } from 'vue';

// app components
import {
    BryntumDemoHeader,
    BryntumCalendar,
    BryntumButton
} from '@bryntum/calendar-vue-3';
import { useCalendarConfig } from '@/AppConfig';

export default {
    name: 'App',

    components: {
        BryntumDemoHeader,
        BryntumCalendar,
        BryntumButton
    },

    setup() {
        const mode = ref('week');
        const calendar = ref(null);
        const calendarConfig = reactive(useCalendarConfig());

        const onButtonClick = function() {
            const modes = Object.keys(calendar.value.instance.value.modes);
            let index = modes.indexOf(mode.value);
            index = index === modes.length - 1 ? 0 : index + 1;
            mode.value = modes[index];
        };

        const onActiveItemChange = function({activeItem}) {
            if(mode.value !== activeItem.modeName) {
                mode.value = activeItem.modeName;
            }
        };

        const capitalize = computed(() => {
            return function(value) {
                if (!value) return '';
                value = value.toString();
                return value.charAt(0).toUpperCase() + value.slice(1);
            };
        });

        return {
            calendarConfig,
            mode,
            onButtonClick,
            onActiveItemChange,
            calendar,
            capitalize
        };
    }
};
</script>

<style lang="scss">
@import './App.scss';
</style>
