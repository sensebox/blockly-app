import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-configuration',
  templateUrl: 'configuration.html',
})
export class ConfigurationPage {
  temp : string;
  humi : string;
  lux : string;
  uv : string;
  pm10 : string;
  pm25 : string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  uploadStandardSketch(){
    console.log(this.temp);
    console.log(this.humi);
    console.log(this.lux);
    console.log(this.uv);
    console.log(this.pm10);
    console.log(this.pm25);
    /**
     * Start OTA Wizard here but with the pre defined sketch here and not with the blockly sketch 
     * 
     * */
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
  }

}
