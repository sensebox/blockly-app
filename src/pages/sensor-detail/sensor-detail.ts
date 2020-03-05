import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SensorDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sensor-detail',
  templateUrl: 'sensor-detail.html',
})
export class SensorDetailPage {

  public sensor:Object=this.navParams.data.sensor
  constructor(public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SensorDetailPage');
    console.log(this.navParams.data.sensor)
  }

}
