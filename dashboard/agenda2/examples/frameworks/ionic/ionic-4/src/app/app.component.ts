import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
    selector    : 'app-root',
    templateUrl : 'app.component.html',
    styleUrls   : ['./app.component.scss']
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
        // Uncomment and make sure to include cordova.js or run in a device/simulator
        // this.statusBar.styleDefault();
        // this.splashScreen.hide();
        });
    }
}
