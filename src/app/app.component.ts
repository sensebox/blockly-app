import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { COLORS, DEFAULT_LANG } from '../constants';
import { BlocklyPage } from '../pages/blockly/blockly';
import { StorageProvider, SETTINGS } from '../providers/storage/storage';

@Component({
  templateUrl: 'app.html'
})
export class openSenseApp {

  @ViewChild(Nav) nav: Nav;

  rootPage:any = BlocklyPage;

  pages: Array<AppPage> = [
    {
      title: 'MENU.BLOCKLY',
      icon: 'code',
      component: 'BlocklyPage'
    },
    {
      title: 'MENU.MYSENSEBOX',
      icon: "person",
      component : 'LoginPage'
    },
    {
      title: 'MENU.DOCS',
      icon: 'book',
      callback: () => {
        window.open(`https://sensebox.github.io/books-v2/blockly/${this.translate.currentLang}/`)
      }
    },
    {
      title: 'MENU.ABOUT',
      icon: 'at',
      component: 'AboutPage'
    },
    {
      title: 'MENU.SETTINGS',
      icon: 'settings',
      component: 'SettingsPage'
    }
  ];

  constructor(
    public translate: TranslateService,
    private storage: StorageProvider,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
  ) {
    this.translate.addLangs(['en', 'de']);
    this.translate.setDefaultLang(DEFAULT_LANG)
    const lang = this.getPreferredLanguage()
    this.translate.use(lang)
    this.storage.get(SETTINGS).language = lang

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

  openPage(page: AppPage) {
    if (page.callback)
      return page.callback()

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    // this.nav.setRoot(page.component);
    this.nav.setRoot(page.component);
  }

  private getPreferredLanguage () {
    const langsAvailable = this.translate.getLangs()
    const lang = this.storage.get(SETTINGS).language || this.translate.getBrowserLang()
    return langsAvailable.indexOf(lang) === -1 ? DEFAULT_LANG : lang
  }
}

interface AppPage {
  title: string,
  icon: string,
  component?: string,
  callback?: () => any,
}
