import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {LoginProvider} from "../../providers/LoginProvider/LoginProvider";
import { SensorsPage } from '../sensors/sensors';
import { ConfigurationPage } from '../configuration/configuration';
/**
 * Generated class for the MySenseBoxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-sense-box',
  templateUrl: 'my-sense-box.html',
})
export class MySenseBoxPage {
  public boxes:Array<Object> = this.navParams.data[0].data.boxes;
  private token:string = this.navParams.data[1];
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private loginProvider: LoginProvider
     ) {
  }

  forwardShow(box){
    this.navCtrl.push(SensorsPage,box)
  }
  forwardSketch(box){
    // Call sketch 
    // forward to config page 
    this.navCtrl.push(ConfigurationPage,box)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MySenseBoxPage');
 }

}
