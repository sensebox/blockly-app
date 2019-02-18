import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { COLORS, DEFAULT_LANG } from '../constants';
import { BlocklyPage } from '../pages/blockly/blockly';

@Component({
  templateUrl: 'app.html'
})
export class openSenseApp {

  @ViewChild(Nav) nav: Nav;

  rootPage:any = BlocklyPage;

  pages: Array<{title: string, component: any}> = [
    { title: 'MENU.BLOCKLY', component: 'BlocklyPage' },
    { title: 'MENU.ABOUT', component: 'AboutPage' },
  ];

  constructor(
    public translate: TranslateService,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
  ) {
    this.translate.setDefaultLang(DEFAULT_LANG)
    this.translate.use(this.translate.getBrowserLang()) // @TODO: check if this works on all platforms!
    platform.ready()
      .then(() => {
        if ((<any>window).cordova) {
          statusBar.overlaysWebView(false)
          statusBar.backgroundColorByHexString(COLORS.PRIMARY)
          statusBar.styleLightContent()
          splashScreen.hide()
        }
      })
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
