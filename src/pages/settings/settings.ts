import { Component } from '@angular/core';
import { IonicPage, ActionSheetController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { StorageProvider, SETTINGS } from '../../providers/storage/storage';
import { DEFAULT_LANG } from '../../constants';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  settings = {} as any

  constructor(
    public actionCtrl: ActionSheetController,
    public translate: TranslateService,
    private storage: StorageProvider,
  ) {
    this.settings = this.storage.get(SETTINGS)
    this.settings.language = this.translate.currentLang
  }

  onSettingsChange (name, value) {
    this.settings[name] = value
    this.storage.set(SETTINGS, this.settings)
    if (name === 'language')
      this.translate.use(value)
  }

  resetStorage() {
    const handler = () => {
      this.storage.reset()
      // update UI state & reset language
      this.settings = this.storage.get(SETTINGS)
      const lang = this.getPreferredLanguage()
      this.storage.get(SETTINGS).language = lang
      this.translate.use(lang)
    }

    this.actionCtrl.create({
      title: this.translate.instant('SETTINGS.RESET.TEXT'),
      buttons: [
        { text: this.translate.instant('CANCEL') },
        { text: this.translate.instant('SETTINGS.RESET.TITLE'), cssClass: 'error', handler },
      ]
    }).present()
  }

  private getPreferredLanguage () {
    const langsAvailable = this.translate.getLangs()
    const lang = this.storage.get(SETTINGS).language || this.translate.getBrowserLang()
    return langsAvailable.indexOf(lang) === -1 ? DEFAULT_LANG : lang
  }
}
