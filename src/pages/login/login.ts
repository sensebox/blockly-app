import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { MySenseBoxPage } from "../my-sense-box/my-sense-box"
import { LoginProvider } from "../../providers/LoginProvider/LoginProvider"
import { ErrorPage } from '../error/error';

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
  private token: string
  private boxes: Object;
  public loading = false;
  public error = false;
  public errorInput = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loginProvider: LoginProvider,
    public loadingController: LoadingController,
    public modalCtrl : ModalController
  ) {
  }

  async presentLoading(){
    const loading = await this.loadingController.create({
      content: 'Please wait...',
      duration: 2000
    })

    loading.present();
  }

  private async submitLogin(form) {
    const loading = await this.loadingController.create({
      content: 'Logging in...'
    })
    loading.present();
    if (form.value.email && form.value.password) {
      try {
        this.token = await this.loginProvider.login(form.value.email, form.value.password)
        this.boxes = await this.loginProvider.getUserBoxes(this.token);
        this.navCtrl.push(MySenseBoxPage, [this.boxes, this.token]);

      }
      catch (err) {
        console.log(err)
        this.showModal(err);
      }
     loading.dismiss();
    }
    else {
      this.errorInput = true;
    }
  }

  showModal(message){
    let modal = this.modalCtrl.create(ErrorPage,message);

    modal.onDidDismiss(()=>{

    })

    modal.present();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

  }

}
