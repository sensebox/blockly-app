import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Platform } from 'ionic-angular'
import { timeout, catchError } from 'rxjs/operators'

// use global var as no @ionic-native/wifiwizard2 package is available yet
declare var WifiWizard2: any

// corresponding to the initial MCU firmware
const SSID_PREFIX = 'sensebox'
const SENSEBOX_API = 'http://192.168.1.1'

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
      return WifiStrategy.Manual
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
          networks = networks.filter(n => n.SSID.toLowerCase().includes(SSID_PREFIX))
          networks = networks.filter(n => n.capabilities.includes('[ESS]'))

        return networks.map(n => n.SSID)
      })
  }

  async connectToSensebox (ssid: string): Promise<any> {
    if (this.strategy != WifiStrategy.Automatic)
      throw new Error('can not connect to WiFi network on this platform')

    return this.platform.is('ios')
      ? WifiWizard2.iOSConnectNetwork(ssid)
      : WifiWizard2.connect(ssid, true)
  }

  async uploadFirmware (binary: string): Promise<any> {
    // TODO: send checksum?
    return this.http.post(`${SENSEBOX_API}/flash`, binary, {
      responseType: 'text',
    })
      .pipe(timeout(2500), catchError(err => {
        throw new Error('senseBox not found. Is it running in OTA mode?')
      }))
      .toPromise()
  }

}

export enum WifiStrategy {
  Automatic   = 'Automatic',   // android, iOS 11+
  Manual      = 'Manual',      // older iOS
  Unavailable = 'Unavailable', // browser
}
