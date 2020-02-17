import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController } from 'ionic-angular';

/**
 * Generated class for the AddItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-item',
  templateUrl: 'add-item.html',
})
export class AddItemPage {

  title:string;
  type:string;
  id:string;
  constructor(public navCtrl: NavController, public view: ViewController) {
  }
  saveSensor(){
    let newSensor = {
      title:this.title,
      type:this.type,
      id:this.id
    }
    this.view.dismiss(newSensor);
  }
  close(){
    this.view.dismiss();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddItemPage');
  }

}
