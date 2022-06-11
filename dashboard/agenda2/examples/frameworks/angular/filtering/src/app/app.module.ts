import { BrowserModule } from '@angular/platform-browser';
import { BryntumCalendarModule } from '@bryntum/calendar-angular';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

@NgModule({
    declarations : [AppComponent],
    imports      : [BrowserModule, BryntumCalendarModule, FormsModule],
    providers    : [],
    bootstrap    : [AppComponent]
})
export class AppModule {}
