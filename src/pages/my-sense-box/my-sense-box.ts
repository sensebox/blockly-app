import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {LoginProvider} from "../../providers/LoginProvider/LoginProvider";
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
  private user: ArrayBuffer=undefined;
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private loginProvider: LoginProvider
     ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MySenseBoxPage');
  console.log(this.navParams)  }

}
