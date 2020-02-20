import { Component, } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { OtaWizardPage } from '../ota-wizard/ota-wizard';
import { HttpClient } from '@angular/common/http';
import { AddItemPage } from '../add-item/add-item';
import { SensorDetailPage } from '../sensor-detail/sensor-detail';
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

  public box:Object = this.navParams.data 
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient, public modalCtrl: ModalController) {
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
  uploadStandardSketch() {
    var values = {
      SSID: this.ssid,
      PASSWORD: this.pw,
      INGRESS_DOMAIN: "ingress.opensensemap.org",
      SENSEBOX_ID: this.senseboxid,
      defineSensors: this.buildDefines(),
      DEBUG_ENABLED:this.DEBUG_ENABLED?"#define ENABLE_DEBUG":"//#define ENABLE_DEBUG",
      NUM_SENSORS: this.sensors.length,
    };
    this.sensors.map((sensor)=>{
      switch (sensor.typ) {
        case "HDC1080":
          values["TEMPERSENSOR_ID"] = sensor.id
          break;
        case "HDC1080_r":
          values["RELLUFSENSOR_ID"] = sensor.id
          break;
        case "BMP280":
          values["LUFTDRSENSOR_ID"] = sensor.id
          break;
        case "TSL45315":
          values["BELEUCSENSOR_ID"] = sensor.id
          break;
        case "VEML6070":
          values["UVINTESENSOR_ID"] = sensor.id
          break;
        case "SDS1001":
          values["PM10SENSOR_ID"] = sensor.id
          break;
        case "SDS1001_r":
          values["PM25SENSOR_ID"] = sensor.id
        default:
          break;
      }
    })
    this.http.get("assets/templates/homev2Wifi.tpl", { responseType: "text" }).subscribe(data => {
      let sketch = this.applyTemplate(data, values);
      console.log(sketch)
      this.navCtrl.push(OtaWizardPage, { sketch })
    })
  }
  buildDefines() {
    let defineString = ""
    this.sensors.map((sensor) => {
      defineString += "#define " + sensor.typ + "_CONNECTED\n"
    })
    
    return defineString;
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
    console.log(this.navParams)
    this.sensors = [
      { typ: "HDC1080", id: "5ca1e336cbf9ae001a6f1d88" },
    ]
  }

}
