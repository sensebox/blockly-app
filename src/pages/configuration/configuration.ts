import { Component, } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
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
  public sensors=[];
  temp : string;
  humi : string;
  lux : string;
  uv : string;
  pm10 : string;
  pm25 : string;
  ssid:string;
  pw:string;
  pressure:string;
  rain:string;
  senseboxid:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,private http:HttpClient,public modalCtrl:ModalController) {
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
   async uploadStandardSketch(){
    var values = {
      SSID: this.ssid,
      PASSWORD:this.pw,
      INGRESS_DOMAIN:"ingress.opensensemap.org",
      SENSEBOX_ID:this.senseboxid,
      NUM_SENSORS:this.sensors.length,
      TEMPERSENSOR_ID:this.temp,
      RELLUFSENSOR_ID:this.humi,
      BELEUCSENSOR_ID:this.lux,
      UVINTESENSOR_ID:this.uv,
      LUFTDRSENOSR_ID:this.pressure,
      REGENMSENSOR_ID:this.rain,
      PM10SENSOR_ID:this.pm10,
      PM25SENSOR_ID:this.pm25
    };
    this.http.get("assets/templates/homev2Wifi.tpl",{responseType:"text"}).subscribe(data=>{
      let sketch  = this.applyTemplate(data,values);
      this.navCtrl.push(OtaWizardPage, { sketch })    
    })
  }

  addSensor(){
    let addModal = this.modalCtrl.create(AddItemPage);

    addModal.onDidDismiss((sensor)=>{
      if(sensor){
        this.saveSensor(sensor);
      }
    })

    addModal.present();

  }

  saveSensor(sensor){
    this.sensors.push(sensor);
    // add define statements
  }
  
  viewSensor(sensor){
    this.navCtrl.push(SensorDetailPage,{
      sensor:sensor
    })
  }

  removeSensor(sensor){
    this.sensors = this.sensors.filter((sensorF)=>{
      return sensor!=sensorF
      })
    }

  ionViewDidLoad() {
    this.sensors =[
      {title:"Temperatur",type:"temp",id:"09327523"},
      {title:"rel. Luftfeuchte",type:"temp",id:"97309852345"}
    ]
  }

}
