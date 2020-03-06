import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MySenseBoxPage } from './my-sense-box';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MySenseBoxPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(MySenseBoxPage),
  ],
})
export class MySenseBoxPageModule {}
