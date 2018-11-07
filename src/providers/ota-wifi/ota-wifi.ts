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
    this.strategy = this.selectStrategy()
  }

  private selectStrategy (): WifiStrategy {
    try {
      // check if plugin is available (e.g. not in browser builds)
      WifiWizard2
    } catch (err) {
      return WifiStrategy.Unavailable
    }

    if (
      this.platform.is('android') ||
      this.platform.is('ios') && this.platform.version().major >= 11
    ) {
      return WifiStrategy.Automatic
    }

    return WifiStrategy.Manual
  }

  async findSenseboxes (filterSsids = false): Promise<string[]> {
    if (this.strategy != WifiStrategy.Automatic)
      throw new Error('can not search for WiFi networks on this platform')

    return WifiWizard2.scan()
      .then(networks => {
        if (filterSsids)
          networks = networks.filter(n => n.SSID.includes(SSID_PREFIX))

        return networks.map(n => n.SSID)
      })
  }

  async connectToSensebox (ssid: string): Promise<any> {
    if (this.strategy != WifiStrategy.Automatic)
      throw new Error('can not connect to WiFi network on this platform')

    return this.platform.is('ios')
      ? WifiWizard2.iOSConnectNetwork(ssid)
      : WifiWizard2.connect(ssid, true)

    // TODO: validate that the MCU server is available
  }

  async uploadFirmware (blob: ArrayBufferLike): Promise<any> {
    return this.http.post(SENSEBOX_API, blob)
  }

}

// TODO: replace with "WifiCapabilities".
// makes it easier to check in each functions if required functionality is available
export enum WifiStrategy {
  Automatic   = 'Automatic',   // android, iOS 11+
  Manual      = 'Manual',      // older iOS
  Unavailable = 'Unavailable', // browser
}
