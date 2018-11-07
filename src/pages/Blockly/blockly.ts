import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SenseBoxPage');
  }

  launchOtaWizard () {
    this.navCtrl.setRoot(OtaWizardPage)
  }

}
