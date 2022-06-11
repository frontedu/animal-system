<!-- Application -->
<template>
    <div id="container">
        <bryntum-demo-header
            link="../../../../../#example-frameworks-vue-javascript-filtering"
        ></bryntum-demo-header>
        <div class="demo-toolbar align-right">
            <bryntum-text-field
                v-bind="findConfig"
                @change="findChangeHandler"
            />
            <bryntum-text-field
                v-bind="highlightConfig"
                @change="highlightChangeHandler"
            />
        </div>
        <bryntum-calendar
            ref="calendar"
            v-bind="calendarConfig"
        ></bryntum-calendar>
    </div>
</template>

<script>
// header
import {
    BryntumCalendar,
    BryntumDemoHeader,
    BryntumTextField
} from '@bryntum/calendar-vue';
import {
    calendarConfig,
    findConfig,
    highlightConfig
} from '@/AppConfig';

export default {
    name: 'App',

    components: {
        BryntumDemoHeader,
        BryntumCalendar,
        BryntumTextField
    },

    data() {
        return {
            calendarConfig,
            findConfig,
            highlightConfig
        };
    },

    methods: {
        findChangeHandler: function({ value }) {
            // We filter using a RegExp, so quote significant characters
            value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // A filter with an id replaces any previous filter with that id.
            // Leave any other filters which may be in use in place.
            this.$refs.calendar.instance.eventStore.filter({
                id: 'eventNameFilter',
                filterBy: event =>
                    event.name.match(new RegExp(value, 'i'))
            });
        },
        highlightChangeHandler: function({ value }) {
            const calendar = this.$refs.calendar.instance;
            value = value.toLowerCase();

            // Loop through all events in the store
            calendar.eventStore.forEach(task => {
                // The cls field is a DomClassList with add and remove methods
                if (
                    value !== '' &&
                    task.name.toLowerCase().includes(value)
                ) {
                    task.cls.add('b-match');
                } else {
                    task.cls.remove('b-match');
                }
            });

            // Schedule a refresh of the UI now that we have updated all event UI classes.
            calendar.refresh();

            calendar.element.classList[
                value.length > 0 ? 'add' : 'remove'
            ]('b-highlighting');
        }
    }
};
</script>

<style lang="scss">
@import './App.scss';
</style>
