import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SenseBoxPage } from './sense-box';

@NgModule({
  declarations: [
    SenseBoxPage,
  ],
  imports: [
    IonicPageModule.forChild(SenseBoxPage),
  ],
})
export class SenseBoxPageModule {}
