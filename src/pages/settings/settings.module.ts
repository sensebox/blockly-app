import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPage } from './settings';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SettingsPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(SettingsPage),
  ],
})
export class SettingsPageModule {}
