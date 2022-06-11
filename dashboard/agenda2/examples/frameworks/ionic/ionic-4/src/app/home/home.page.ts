import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BryntumCalendarComponent } from '@bryntum/calendar-angular';
import { Calendar, EventStore } from '@bryntum/calendar/calendar.lite.umd.js';
import { calendarConfig } from '../app.config';

interface CalendarData {
    success: boolean
    events: { rows: Array<Record<string, any>> }
    resources: { rows: Array<Record<string, any>> }
}

@Component({
    selector    : 'app-home',
    templateUrl : 'home.page.html',
    styleUrls   : ['home.page.scss']
})
export class HomePage implements AfterViewInit {
    @ViewChild(BryntumCalendarComponent) calendarComponent: BryntumCalendarComponent;

    private calendar: Calendar;
    private eventStore: EventStore;

    calendarConfig = calendarConfig;

    events: Array<Record<string, any>>;
    resources: Array<Record<string, any>>;

    // inject HttpClient
    constructor(private http: HttpClient) {}

    /**
     * Called after View is initialized
     */
    ngAfterViewInit(): void {
        this.calendar = this.calendarComponent.instance;
        this.eventStore = this.calendar.eventStore;

        this.http
            .get<CalendarData>('assets/data/data.json')
            .subscribe((data: CalendarData) => {
                this.resources = data.resources.rows;
                this.events = data.events.rows;
            });
    }

    onCalendarEvents(event): void {
        // Uncomment the code in this method to start "logging" events
        /*
        switch (event.type) {
          case 'aftereventsave':
            console.log(`New event saved: ${event.eventRecord.name}`);
            break;

          case 'beforeeventdelete':
            console.log(`Events removed: ${event.eventRecords.map(eventRecord => eventRecord.name).join(',')}`);
            break;
        }
        */
    }
}
