import { Component, } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { OtaWizardPage } from '../ota-wizard/ota-wizard';
import { HttpClient } from '@angular/common/http';
import { AddItemPage } from '../add-item/add-item';
import { SensorDetailPage } from '../sensor-detail/sensor-detail';
import { LoginProvider } from "../../providers/LoginProvider/LoginProvider"
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
  
  public sensors = [];
  ssid:string;
  pw:string;
  DEBUG_ENABLED:boolean;
  senseboxid: string;
  private token:string=this.navParams.data[1]
  public box:Object = this.navParams.data[0]
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient, public modalCtrl: ModalController,    private loginProvider: LoginProvider
    ) {
  }

  applyTemplate(template, properties) {
    var returnValue = "";

    var templateFragments = template.split("@{");
    returnValue += templateFragments[0];

    for (var i = 1; i < templateFragments.length; i++) {
      var fragmentSections = templateFragments[i].split("}@", 2);
      returnValue += properties[fragmentSections[0]];
      returnValue += fragmentSections[1];
    }

    return returnValue;
  }
  async uploadStandardSketch() {
    const sketch = await this.loginProvider.getUserSketch(this.token,this.box['_id'],this.ssid,this.pw)
    this.navCtrl.push(OtaWizardPage,{sketch})
  }

  addSensor() {
    let addModal = this.modalCtrl.create(AddItemPage);

    addModal.onDidDismiss((sensor) => {
      if (sensor) {
        this.saveSensor(sensor);
      }
    })

    addModal.present();

  }

  saveSensor(sensor) {
    this.sensors.push(sensor);
    // add define statements
  }

  viewSensor(sensor) {
    this.navCtrl.push(SensorDetailPage, {
      sensor: sensor
    })
  }

  removeSensor(sensor) {
    this.sensors = this.sensors.filter((sensorF) => {
      return sensor != sensorF
    })
  }

  ionViewDidLoad() {
  }

}
