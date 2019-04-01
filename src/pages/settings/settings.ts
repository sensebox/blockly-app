import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { StorageProvider, SETTINGS } from '../../providers/storage/storage';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  settings = {} as any

  constructor(
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
}
