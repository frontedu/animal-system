import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomePageModule } from './home/home.module';

@NgModule({
    declarations : [
        AppComponent
    ],
    entryComponents : [],
    imports         : [BrowserModule, IonicModule.forRoot(), AppRoutingModule,  HomePageModule, HttpClientModule],
    providers       : [
        StatusBar,
        SplashScreen,
        { provide : RouteReuseStrategy, useClass : IonicRouteStrategy }
    ],
    bootstrap : [AppComponent]
})
export class AppModule {}
