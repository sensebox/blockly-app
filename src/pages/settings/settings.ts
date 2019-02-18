import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { StorageProvider, SETTINGS } from '../../providers/storage/storage';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  settings = {}

  constructor(private storage: StorageProvider) {
    this.settings = this.storage.get(SETTINGS)
  }

  onSettingsChange (name, value) {
    this.settings[name] = value
    this.storage.set(SETTINGS, this.settings)
  }
}
