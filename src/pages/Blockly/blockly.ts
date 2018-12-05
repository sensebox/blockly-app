import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OtaWizardPage } from '../ota-wizard/ota-wizard';


@IonicPage()
@Component({
  selector: 'page-blockly',
  templateUrl: 'blockly.html',
})
export class BlocklyPage implements OnInit{

  ngOnInit(){   

  }

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
