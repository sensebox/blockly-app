import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SensorDetailPage } from '../sensor-detail/sensor-detail';

/**
 * Generated class for the SensorsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sensors',
  templateUrl: 'sensors.html',
})
export class SensorsPage {
  public box:Object = this.navParams.data
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  viewSensor(sensor){
    this.navCtrl.push(SensorDetailPage,{sensor:sensor})
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SensorsPage');
  }

}
