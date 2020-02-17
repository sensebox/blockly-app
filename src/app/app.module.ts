import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { openSenseApp } from './app.component';
import { OtaWizardPageModule } from '../pages/ota-wizard/ota-wizard.module';
import { BlocklyPageModule } from '../pages/blockly/blockly.module';
import { LoggingProvider } from '../providers/logging/logging';
import { StorageProvider } from '../providers/storage/storage';
import { AddItemPage } from '../pages/add-item/add-item';
import { SensorDetailPage } from '../pages/sensor-detail/sensor-detail';

// For AoT compilation (production builds) we need to have a factory for the loader of translation files.
// @TODO: we possibly could optimize this by using a static loader in combination with webpack:
// https://github.com/ngx-translate/http-loader#angular-cliwebpack-translateloader-example
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    openSenseApp,
    AddItemPage,
    SensorDetailPage
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    OtaWizardPageModule,
    BlocklyPageModule,
    IonicModule.forRoot(openSenseApp),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    openSenseApp,
    AddItemPage,
    SensorDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoggingProvider,
    StorageProvider,
  ]
})
export class AppModule {}
