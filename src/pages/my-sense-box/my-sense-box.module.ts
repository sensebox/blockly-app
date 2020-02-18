import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MySenseBoxPage } from './my-sense-box';

@NgModule({
  declarations: [
    MySenseBoxPage,
  ],
  imports: [
    IonicPageModule.forChild(MySenseBoxPage),
  ],
})
export class MySenseBoxPageModule {}
