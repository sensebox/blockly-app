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
  sketchtext = 'void setup() {\n  Serial.begin(9600);\n  Serial.println(\"Hello World\");\n}\n\nvoid loop() {\n\n}'

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) { }

  launchOtaWizard() {
    this.navCtrl.push(OtaWizardPage,{ sketch : this.sketchtext })
  }

}
