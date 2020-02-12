import { Component, } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OtaWizardPage } from '../ota-wizard/ota-wizard';
import { HttpClient } from '@angular/common/http';
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
  constructor(public navCtrl: NavController, public navParams: NavParams,private http:HttpClient) {
  }

  async launchOtaWizard () {

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
  uploadStandardSketch(){
    // possily add define statements here based on inputs given or checkboxes checked 
    let sketchy = "#define HDC1080\n";
    this.http.get("assets/templates/homev2Wifi.tpl",{responseType:"text"}).subscribe(data=>{
      sketchy = sketchy+data;
      var values = {
        SSID: this.ssid,
        PASSWORD:this.pw,
        INGRESS_DOMAIN:"ingress.opensensemap.org",
        SENSEBOX_ID:this.senseboxid,
        NUM_SENSORS:6,
        TEMPERSENSOR_ID:this.temp,
        RELLUFSENSOR_ID:this.humi,
        BELEUCSENSOR_ID:this.lux,
        UVINTESENSOR_ID:this.uv,
        LUFTDRSENOSR_ID:this.pressure,
        REGENMSENSOR_ID:this.rain,
        PM10SENSOR_ID:this.pm10,
        PM25SENSOR_ID:this.pm25
      };
      sketchy  = this.applyTemplate(sketchy,values);
    })

    /**
     * Start OTA Wizard here but with the pre defined sketch here and not with the blockly sketch 
     * 
     ** 
     */
    const sketch =  'void setup(){Serial.begin(9600);} void loop(){Serial.println("Working");}'
    this.navCtrl.push(OtaWizardPage, { sketchy })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
  }

}
