import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { BryntumCalendarComponent } from '@bryntum/calendar-angular';
import { Calendar } from '@bryntum/calendar/calendar.lite.umd.js';
import { calendarConfig } from './app.config';
import { projectData } from './app.data';

@Component({
    selector    : 'app-root',
    templateUrl : './app.component.html'
})
export class AppComponent implements AfterViewInit {
    @ViewChild(BryntumCalendarComponent) calendarComponent: BryntumCalendarComponent;

    private calendar: Calendar;

    calendarConfig = calendarConfig;
    projectData = projectData;

    /**
     * Called after View is initialized
     */
    ngAfterViewInit(): void {
        // Calendar instance
        this.calendar = this.calendarComponent.instance;
    }

}
