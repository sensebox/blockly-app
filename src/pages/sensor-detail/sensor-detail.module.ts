import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SensorDetailPage } from './sensor-detail';

@NgModule({
  declarations: [
    SensorDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SensorDetailPage),
  ],
})
export class SensorDetailPageModule {}
