import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ErrorPage } from './error';

@NgModule({
  declarations: [
    ErrorPage,
  ],
  imports: [
    IonicPageModule.forChild(ErrorPage),
  ],
})
export class ErrorPageModule {}
