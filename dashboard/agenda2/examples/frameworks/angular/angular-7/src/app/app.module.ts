import { BrowserModule } from '@angular/platform-browser';
import { BryntumCalendarModule } from '@bryntum/calendar-angular';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

@NgModule({
    declarations : [AppComponent],
    imports      : [
        BrowserModule,
        HttpClientModule,
        BryntumCalendarModule
    ],
    providers : [],
    bootstrap : [AppComponent]
})
export class AppModule {}
