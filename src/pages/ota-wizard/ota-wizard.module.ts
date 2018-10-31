import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtaWizardPage } from './ota-wizard';

@NgModule({
  declarations: [
    OtaWizardPage,
  ],
  imports: [
    IonicPageModule.forChild(OtaWizardPage),
  ],
})
export class OtaWizardPageModule {}
