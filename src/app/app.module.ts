import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { openSenseApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ApiProvider } from '../providers/api/api';
import { HttpClientModule } from '@angular/common/http';
import { OtaWizardPage } from '../pages/ota-wizard/ota-wizard';
import { OtaWizardPageModule } from '../pages/ota-wizard/ota-wizard.module';

@NgModule({
  declarations: [
    openSenseApp,
    HomePage,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    OtaWizardPageModule,
    IonicModule.forRoot(openSenseApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    openSenseApp,
    OtaWizardPage,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
  ]
})
export class AppModule {}
