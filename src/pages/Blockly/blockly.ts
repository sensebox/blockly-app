import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OtaWifiProvider } from '../../providers/ota-wifi/ota-wifi';
import { OtaWizardPage } from '../ota-wizard/ota-wizard';

/**
 * Generated class for the SenseBoxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-blockly',
  templateUrl: 'blockly.html',
})
export class BlocklyPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private otaWifi: OtaWifiProvider) {
      // otaWifi is here only for testing, should later be encapsulated by OtaWizardComponent
      console.log('wifi strategy:', otaWifi.strategy)
      otaWifi.findSenseboxes()
        .then(console.log)
        .catch(console.error)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SenseBoxPage');
  }

  launchOtaWizard () {
    this.navCtrl.setRoot(OtaWizardPage)
  }

}
