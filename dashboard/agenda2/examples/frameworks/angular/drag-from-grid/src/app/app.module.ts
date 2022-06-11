import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BryntumCalendarModule } from '@bryntum/calendar-angular';

import { AppComponent } from './app.component';

@NgModule({
    declarations : [AppComponent],
    imports      : [BrowserModule, BryntumCalendarModule],
    providers    : [],
    bootstrap    : [AppComponent]
})
export class AppModule {}
