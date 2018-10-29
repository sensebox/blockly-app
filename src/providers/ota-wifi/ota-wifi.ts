import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform } from 'ionic-angular';

// use global var as no @ionic-native/wifiwizard2 package is available yet
declare var WifiWizard2: any;

// corresponding to the initial MCU firmware
const SSID_PREFIX = 'sensebox';
const SENSEBOX_API = 'http://192.168.0.1:80';

/*
  Interface for uploading a binary to a senseBox MCU.
*/
@Injectable()
export class OtaWifiProvider {
  public strategy: WifiStrategy

  constructor(private platform: Platform, private http: HttpClient) {
    this.selectStrategy()
  }

  private selectStrategy (): WifiStrategy {
    try {
      // check if plugin is available (e.g. not in browser builds)
      WifiWizard2

      if (
        this.platform.is('android') ||
        this.platform.is('ios') && this.platform.version().major >= 11
      ) {
        this.strategy = WifiStrategy.Automatic
      } else {
        this.strategy = WifiStrategy.Manual
      }
    } catch (err) {
      this.strategy = WifiStrategy.Unavailable
    }

    return this.strategy;
  }

  async findSenseboxes (): Promise<string> {
    if (this.strategy != WifiStrategy.Automatic)
      throw Error('can not search for WiFi networks on this platform')

    return WifiWizard2.scan()
      .then(n => n.filter(n.SSID.includes(SSID_PREFIX)))
      .then(n => n.map(n => n.SSID))
  }

  async connectToSensebox (ssid: string): Promise<any> {
    if (this.strategy != WifiStrategy.Automatic)
      throw Error('can not connect to WiFi network on this platform')

    return this.platform.is('ios')
      ? WifiWizard2.iOSConnectNetwork(ssid)
      : WifiWizard2.connect(ssid, true)
  }

  async uploadFirmware (blob: ArrayBufferLike): Promise<any> {
    return this.http.post(SENSEBOX_API, blob)
  }

}

// TODO: replace with "WifiCapabilities".
// makes it easier to check in each functions if required functionality is available
enum WifiStrategy {
  Automatic,   // android, iOS 11+
  Manual,      // older iOS
  Unavailable, // browser
}
