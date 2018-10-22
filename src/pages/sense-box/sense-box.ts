import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SenseBoxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sense-box',
  templateUrl: 'sense-box.html',
})
export class SenseBoxPage {

  boxData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SenseBoxPage');
  }

  getData(){
    this.api.getData().subscribe(res => {
      console.log(res);
      this.boxData = res;
    })

  }

}
