import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { AboutPage } from './about';

@NgModule({
  declarations: [
    AboutPage,
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(AboutPage),
  ],
})
export class AboutPageModule {}
