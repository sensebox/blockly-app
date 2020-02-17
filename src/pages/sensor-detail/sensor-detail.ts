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

  title;
  type;
  id;

  constructor(public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SensorDetailPage');
    this.title=this.navParams.get('sensor').title;
    this.type = this.navParams.get('sensor').type;
    this.id = this.navParams.get('sensor').id;
  }

}
