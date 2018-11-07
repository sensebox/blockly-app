import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import {
  IonicPage,
  Slides,
} from 'ionic-angular'
import { Network } from '@ionic-native/network'
import { Subscription } from 'rxjs/Subscription';

import { OtaWifiProvider, WifiStrategy } from '../../providers/ota-wifi/ota-wifi';

@IonicPage()
@Component({
  selector: 'page-ota-wizard',
  templateUrl: 'ota-wizard.html',
})
export class OtaWizardPage implements OnInit, OnDestroy {
  @ViewChild(Slides) slides: Slides
  onlineSub: Subscription
  offlineSub: Subscription

  filterSsids = false // TODO: add toggle to UI?
  availableSenseboxes: string[] = [] // list of SSIDs
  compiledSketch = undefined
  errorMsg = ''

  state: OtaState = {
    isOnline: false,
    compilation: 'compiling',
    wifiSelection: 'scanning',
  }

  constructor(
    private network: Network,
    private otaWifi: OtaWifiProvider,
  ) {
  }

  ngOnInit() {
    // try to start compilation already in the background
    this.compileSketch()

    this.state.isOnline = this.network.type !== 'none'

    this.onlineSub = this.network.onConnect().subscribe(() => {
      this.state.isOnline = true
      // trigger compilation, only when needed
      if (this.state.compilation == 'go-online') this.compileSketch()
    })

    this.offlineSub = this.network.onDisconnect().subscribe(() => {
      this.state.isOnline = false
    })
  }

  ngOnDestroy () {
    this.onlineSub.unsubscribe()
    this.offlineSub.unsubscribe()
  }

  // call logic for each slide
  onSlideChange () {
    switch (this.slides.getActiveIndex()) {
      case OtaSlides.Intro:
        this.slides.lockSwipeToNext(false)
        break

      case OtaSlides.Compilation:
        this.handleCompilation()
        break

      case OtaSlides.WifiSelection:
        this.handleWifiSelection()
        break

      case OtaSlides.Upload:
        this.slides.lockSwipeToNext(true)
        break

      default:
        console.warn('unknown slide, please define its logic')
    }
  }

  async connectToSensebox (ssid: string) {
    this.state.wifiSelection = 'connecting'
    try {
      await this.otaWifi.connectToSensebox(ssid)
      this.state.wifiSelection = 'select'
      this.slides.lockSwipeToNext(false)
      this.slides.slideNext()
    } catch (err) {
      this.state.wifiSelection = 'error'
      this.errorMsg = err.message
    }
  }

  private handleCompilation () {
    this.slides.lockSwipeToNext(!this.compiledSketch)

    // need to go online for compilation. compilation is retriggered via this.onlineSub
    if (!this.compiledSketch && !this.state.isOnline) {
      switch (this.otaWifi.strategy) {
        case WifiStrategy.Automatic:
          // TODO: auto connect to previous network, if available
        default:
          this.state.compilation = 'go-online'
          break
      }
    }
  }

  private async handleWifiSelection () {
    this.slides.lockSwipeToNext(true)

    if (this.otaWifi.strategy == WifiStrategy.Manual) {
      this.state.wifiSelection = 'manual'
    } else {
      this.state.wifiSelection = 'scanning'
      try {
        this.availableSenseboxes = await this.otaWifi.findSenseboxes(this.filterSsids)
        this.state.wifiSelection = 'select'
      } catch (err) {
        this.state.wifiSelection = 'error'
        this.errorMsg = err.message
      }
    }
  }

  private compileSketch () {
    // TODO: mock
    this.state.compilation = 'compiling'
    setTimeout(() => {
      this.compiledSketch = 'firmware binary here..'
      this.state.compilation = 'done'
      this.slides.lockSwipeToNext(false)
    }, 4000)
  }
}

type OtaState = {
  isOnline: boolean,
  compilation: 'compiling' | 'go-online' | 'done' | 'error',
  wifiSelection: 'scanning' | 'connecting' | 'select' | 'manual' | 'error',
}

// names for the slide indices for easier access
enum OtaSlides {
  Intro = 0,
  Compilation = 1,
  WifiSelection = 2,
  Upload = 3,
}
