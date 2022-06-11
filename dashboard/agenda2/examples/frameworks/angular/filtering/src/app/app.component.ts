import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { BryntumCalendarComponent } from '@bryntum/calendar-angular';
import { Calendar, EventModel, EventStore } from '@bryntum/calendar/calendar.lite.umd.js';
import { calendarConfig } from './app.config';

@Component({
    selector    : 'app-root',
    templateUrl : './app.component.html'
})
export class AppComponent implements AfterViewInit {
    @ViewChild(BryntumCalendarComponent) calendarComponent: BryntumCalendarComponent;

    private calendar: Calendar;
    private eventStore: EventStore;

    // calendar configuration
    calendarConfig = calendarConfig;

    filterTriggers = {
        filter : {
            align : 'start',
            cls   : 'b-fa b-fa-filter'
        }
    };

    highlightTriggers = {
        filter : {
            align : 'start',
            cls   : 'b-fa b-fa-highlighter'
        }
    };

    /**
     * Find by name text field change handler
     */
    onFindChange({ value }: any): void {
        // We filter using a RegExp, so quote significant characters
        const val = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // A filter with an id replaces any previous filter with that id.
        // Leave any other filters which may be in use in place.
        this.calendar.eventStore.filter({
            id       : 'eventNameFilter',
            filterBy : (event: EventModel) => event.name.match(new RegExp(val, 'i'))
        });
    }

    /**
     * Highlight text field change handler
     */
    onHighlightChange({ value }: any): void {
        const
            val = value.toLowerCase(),
            { eventStore, calendar } = this;

        // Calendars refresh on any data change so suspend that.
        // We will trigger the store's change event when we're done.
        eventStore.suspendEvents();

        // Loop through all events in the store
        eventStore.forEach((task) => {
            // The cls field is a DomClassList with add and remove methods
            if (val !== '' && task.name.toLowerCase().includes(val)) {
                task.cls.add('b-match');
            }
            else {
                task.cls.remove('b-match');
            }
        });
        eventStore.resumeEvents();

        // Announce that data has changed which will refresh UIs.
        eventStore.trigger('change');

        calendar.element.classList[value.length > 0 ? 'add' : 'remove']('b-highlighting');
    }

    /**
     * Called after View is initialized
     */
    ngAfterViewInit(): void {
        this.calendar = this.calendarComponent.instance;
        this.eventStore = this.calendar.eventStore;

        // Uncomment the code below in this method to start "logging" eventStore events
        // const eventStore = this.calendar.calendarInstance.eventStore;
        // eventStore.on('change', ({ action, record, records }) => {
        //
        //     const eventNames = records && records.map(eventRecord => eventRecord.name).join(',');
        //
        //     switch (action) {
        //         case 'update':
        //             console.log(`Event updated: ${record.name}`);
        //             break;
        //
        //         case 'add':
        //             console.log(`Events added: ${eventNames}`);
        //             break;
        //
        //         case 'remove':
        //             console.log(`Events removed: ${eventNames}`);
        //             break;
        //     }
        // });
    }

    onCalendarEvents(event: any): void {
        // Uncomment the code in this method to start "logging" events
        // switch (event.type) {
        //     case 'aftereventsave':
        //         console.log(`New event saved: ${event.eventRecord.name}`);
        //         break;
        //
        //     case 'beforeeventdelete':
        //         console.log(`Events removed: ${event.eventRecords.map(eventRecord => eventRecord.name).join(',')}`);
        //         break;
        // }
    }
}
