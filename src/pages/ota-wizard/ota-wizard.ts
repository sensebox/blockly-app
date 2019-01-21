import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import {
  IonicPage,
  Slides,
  NavController,
  NavParams,
} from 'ionic-angular'
import { Network } from '@ionic-native/network'
import { Subscription } from 'rxjs/Subscription';

import { OtaWifiProvider, WifiStrategy } from '../../providers/ota-wifi/ota-wifi';
import { CompilerProvider } from '../../providers/compiler/compiler';

@IonicPage()
@Component({
  selector: 'page-ota-wizard',
  templateUrl: 'ota-wizard.html',
})
export class OtaWizardPage implements OnInit, OnDestroy {
  @ViewChild(Slides) slides: Slides
  onlineSub: Subscription
  offlineSub: Subscription

  sketch = ''
  filterSsids = true
  availableSenseboxes: string[] = [] // list of SSIDs
  compiledSketch: ArrayBuffer = undefined
  errorMsg = ''

  state: OtaState = {
    isOnline: false,
    compilation: 'compiling',
    wifiSelection: 'scanning',
    upload: 'uploading',
  }

  constructor(
    private network: Network,
    private otaWifi: OtaWifiProvider,
    private navCtrl : NavController,
    navParams : NavParams,
    private compilerprovider:CompilerProvider
  ) {
    this.sketch = navParams.get('sketch')

    // for OTA to work, the new sketch has to include the OTA logic as well.
    // to ensure that, we're prepending it here to the sketch.
    // this also works regardless wether the sketch already contains this line.
    this.sketch = '#include <SenseBoxOTA.h>\n' + this.sketch
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

  onWifiRefresh () {
    this.handleWifiSelection()
  }

  onFilterToggle (newVal) {
    this.filterSsids = newVal
    this.handleWifiSelection()
  }

  onClose () {
    this.navCtrl.pop()
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
        this.handleUpload()
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
    // skip compilation slide if already compiled
    this.slides.lockSwipeToNext(!this.compiledSketch)
    if (this.compiledSketch)
      return this.slides.slideNext(0)

    // need to go online for compilation. compilation is retriggered via this.onlineSub
    if (!this.state.isOnline) {
      switch (this.otaWifi.strategy) {
        case WifiStrategy.Automatic:
          // TODO: auto connect to previous network, if available
        default:
          this.state.compilation = 'go-online'
          break
      }
    } else {
      this.compileSketch()
    }
  }

  private async handleWifiSelection () {
    this.slides.lockSwipeToNext(true)

    if (this.otaWifi.strategy == WifiStrategy.Manual) {
      this.state.wifiSelection = 'manual'
      this.slides.lockSwipeToNext(false)
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

  private async handleUpload () {
    this.state.upload = 'uploading'
    try {
      const res = await this.otaWifi.uploadFirmware(this.compiledSketch)
      console.log(JSON.stringify(res, null, 2))

      this.state.upload = 'done'
      this.slides.lockSwipeToNext(false)
    } catch (err) {
      this.state.upload = 'error'
      this.errorMsg = err.message
    }

  }

  private async compileSketch () {
    this.state.compilation = 'compiling'
    try {
      this.compiledSketch = await this.compilerprovider.callcompiler(this.sketch)
      this.state.compilation = 'done'
      this.slides.lockSwipeToNext(false)
    } catch (err) {
      this.state.compilation = 'error'
      this.errorMsg = !err.message ? err : err.message
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '<br/>')
    }
  }
}

type OtaState = {
  isOnline: boolean,
  compilation: 'compiling' | 'go-online' | 'done' | 'error',
  wifiSelection: 'scanning' | 'connecting' | 'select' | 'manual' | 'error',
  upload: 'uploading' | 'done' | 'error',
}

// names for the slide indices for easier access
enum OtaSlides {
  Intro = 0,
  Compilation = 1,
  WifiSelection = 2,
  Upload = 3,
}
