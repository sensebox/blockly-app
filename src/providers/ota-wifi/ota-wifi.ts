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

    // FIXME: iOS 11+ supposedly allows WiFi API queries (see WifiWizard2 docs),
    // but testing in emulator gives "not supported". might be an emulator issue?
    // if (this.platform.is('android'))
    return WifiStrategy.Automatic

    //return WifiStrategy.Manual
  }

  async findSenseboxes (filterSsids = false): Promise<string[]> {
    if (this.strategy != WifiStrategy.Automatic)
      throw new Error('can not search for WiFi networks on this platform')

    try {
      let networks = await WifiWizard2.scan()
      if (filterSsids)
        networks = networks.filter(n => n.SSID.toLowerCase().includes(SSID_PREFIX))

      return networks
        .filter(n => n.capabilities.includes('[ESS]')) // only unencrypted networks
        .map(n => n.SSID)
        .filter((val, i, arr) => arr.indexOf(val) === i) // unique filter (as networks are duplicated per BSSID)
    } catch (err) {
      if (err === 'SCAN_FAILED')
        throw new Error('WiFi scan failed. Maybe location services are disabled or the location permission isn\'t set for this app?')
      else
        throw new Error(err)
    }
  }

  async connectToSensebox (ssid: string): Promise<any> {
    if (this.strategy != WifiStrategy.Automatic)
      throw new Error('can not connect to WiFi network on this platform')

    return this.platform.is('ios')
      ? WifiWizard2.iOSConnectNetwork(ssid)
      : WifiWizard2.connect(ssid, true) // true: bind to all connections, even without internet
  }

  async uploadFirmware (binary: ArrayBuffer): Promise<any> {
    // TODO: send checksum?
    return this.http.post(`${SENSEBOX_API}/sketch`, binary, {
      responseType: 'text',
    })
      .pipe(timeout(5000), catchError(err => {
        throw new Error('senseBox not found. Is it running in OTA mode?')
      }))
      .toPromise()
  }

}

export enum WifiStrategy {
  Automatic   = 'Automatic',   // android
  Manual      = 'Manual',      // iOS, browser
  Unavailable = 'Unavailable', // currently unused
}
