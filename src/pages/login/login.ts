import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MySenseBoxPage} from "../my-sense-box/my-sense-box"
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  userName: string;
  password: string;
  public loading=false;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  submitLogin(){
    this.loading = true;
    // make api call to login with the credentials 
    this.navCtrl.push(MySenseBoxPage)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
