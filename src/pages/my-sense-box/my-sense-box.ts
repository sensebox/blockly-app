import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {LoginProvider} from "../../providers/LoginProvider/LoginProvider";
import { SensorsPage } from '../sensors/sensors';
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
  token:string;
  public boxes:Array<any>;
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private loginProvider: LoginProvider
     ) {
  }

  forwardShow(box){
    this.navCtrl.push(SensorsPage,box)
  }

  forwardEdit(box){

  }

  forwardSketch(box){
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MySenseBoxPage');
    this.boxes = this.navParams.data.data.boxes
    console.log(this.boxes);
 }

}
