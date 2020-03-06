import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ErrorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-error',
  templateUrl: 'error.html',
})
export class ErrorPage {
  public error = this.navParams.data
  public errorMessages = {
    403:"Please check your username and password and try again! ",
    500:"There seems to be no connection to the OSeM"
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,public view: ViewController) {
  }
  dismissModal(){
    this.view.dismiss();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ErrorPage');
    console.log(this.navParams)
  }

}
