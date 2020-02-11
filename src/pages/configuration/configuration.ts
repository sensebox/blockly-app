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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  uploadStandardSketch(){
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
  }

}
