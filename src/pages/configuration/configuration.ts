import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OtaWizardPage } from '../ota-wizard/ota-wizard';
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

  async launchOtaWizard () {

  }

  uploadStandardSketch(){

    /**
     * Start OTA Wizard here but with the pre defined sketch here and not with the blockly sketch 
     * 
     * */
    const sketch =  'void setup(){Serial.begin(9600);} void loop(){Serial.println("Working");}'
    this.navCtrl.push(OtaWizardPage, { sketch })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
  }

}
