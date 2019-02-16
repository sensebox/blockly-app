import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { openSenseApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { OtaWizardPage } from '../pages/ota-wizard/ota-wizard';
import { OtaWizardPageModule } from '../pages/ota-wizard/ota-wizard.module';
import { BlocklyPageModule } from '../pages/blockly/blockly.module';
import { BlocklyPageModule } from '../pages/Blockly/blockly.module';

@NgModule({
  declarations: [
    openSenseApp,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    OtaWizardPageModule,
    BlocklyPageModule,
    IonicModule.forRoot(openSenseApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    openSenseApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
