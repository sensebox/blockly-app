import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigurationPage } from './configuration';

@NgModule({
  declarations: [
    ConfigurationPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(ConfigurationPage),
  ],
})
export class ConfigurationPageModule {}
