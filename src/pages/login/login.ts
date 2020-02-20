import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MySenseBoxPage} from "../my-sense-box/my-sense-box"
import { LoginProvider } from "../../providers/LoginProvider/LoginProvider"
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
export class LoginPage  {
  userName: string;
  password: string;
  private token:string
  private user:ArrayBuffer=undefined;
  public loading=false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loginProvider: LoginProvider
     ) {
  }

  private async submitLogin(form){
    try {
      this.token = await this.loginProvider.login("e_thie10@uni-muenster.de","Qxpxtexb1")
      this.user = await this.loginProvider.getUser(this.token);
    }
    catch(err){
      console.log(err.message)
    }
    this.navCtrl.push(MySenseBoxPage,this.user);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
