import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
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
import { LoggingProvider } from '../../providers/logging/logging';

@IonicPage()
@Component({
  selector: 'page-ota-wizard',
  templateUrl: 'ota-wizard.html',
})
export class OtaWizardPage implements OnInit, OnDestroy {
  @ViewChild(Slides) slides: Slides
  availableSenseboxes: string[] = [] // list of SSIDs
  errorMsg = ''
  state: OtaState = {
    isOnline: false,
    compilation: 'compiling',
    wifiSelection: 'scanning',
    upload: 'uploading',
  }

  // for unified slide index access in the template
  slideCompilation = OtaSlides.Compilation
  slideWifi = OtaSlides.WifiSelection
  slideUpload = OtaSlides.Upload

  private onlineSub: Subscription
  private offlineSub: Subscription
  private sketch = ''
  private compiledSketch: ArrayBuffer = undefined
  private hiddenSlides: OtaSlides[] = []

  private log: LoggingProvider
  private slideHistory: string[] = [OtaSlides[OtaSlides.Intro]] // for debug info in logs
  private counts = { compile: 0, connect: 0, upload: 0 }

  constructor(
    private network: Network,
    private otaWifi: OtaWifiProvider,
    private navCtrl: NavController,
    private webcompiler: CompilerProvider,
    private changedetect: ChangeDetectorRef,
    logger: LoggingProvider,
    navParams : NavParams,
  ) {
    // for OTA to work, the new sketch has to include the OTA logic as well.
    // to ensure that, we're prepending it here to the sketch.
    // this also works regardless wether the sketch already contains this line.
    this.sketch = '#include <SenseBoxOTA.h>\n'

    // get sketch from router param, or set minimal default code for successful compilation
    let sketch = navParams.get('sketch')
    if (!sketch)
      sketch = 'void setup() {}\nvoid loop() {}\n'

    this.sketch += sketch

    this.log = logger.createChild('OtaWizardPage', {
      otaState: this.state,
      slideHistory: this.slideHistory,
      counts: this.counts,
      sketch: this.sketch,
      wifis: this.availableSenseboxes,
    })
  }

  ngOnInit() {
    // try to start compilation already in the background
    this.compileSketch()
      .then(() => this.hideSlide(OtaSlides.Compilation))

    if (this.otaWifi.strategy === WifiStrategy.Automatic) {
      this.otaWifi.findSenseboxes(true)
        .then(ssids => this.availableSenseboxes = ssids)
    } else {
      this.state.wifiSelection = 'manual'
    }

    this.state.isOnline = this.network.type !== 'none'

    this.onlineSub = this.network.onConnect().subscribe(() => {
      this.state.isOnline = true
      // trigger compilation, only when needed
      if (this.state.compilation == 'go-online') this.compileSketch()
    })

    this.offlineSub = this.network.onDisconnect().subscribe(() => {
      this.state.isOnline = false
    })

    this.log.debug('initialized')
  }

  ngOnDestroy () {
    this.onlineSub.unsubscribe()
    this.offlineSub.unsubscribe()
  }

  onWifiRefresh () {
    this.handleWifiSelection(true)
  }

  onClose () {
    this.navCtrl.pop()
  }

  // call logic for each slide
  onSlideChange () {
    this.slideHistory.push(OtaSlides[this.currentSlide])
    switch (this.currentSlide) {
      case OtaSlides.Intro:
      case OtaSlides.Intro2:
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
        this.log.warn('unknown slide, please define its logic', { slide: this.currentSlide })
    }
  }

  get currentSlide (): OtaSlides {
    const current = this.slides.getActiveIndex()
    const hiddenOffset = this.hiddenSlides.filter(slide => slide <= current).length
    return current + hiddenOffset
  }

  slideIsHidden (slide: OtaSlides): boolean {
    return this.hiddenSlides.indexOf(slide) !== -1
  }

  private hideSlide (slide: OtaSlides) {
    if (this.currentSlide === slide) return
    if (this.slideIsHidden(slide)) return
    this.hiddenSlides.push(slide)
    this.slides.update()
  }

  async connectToSensebox (ssid: string) {
    this.counts.connect++
    this.state.wifiSelection = 'connecting'
    try {
      await this.otaWifi.connectToSensebox(ssid)
      this.state.wifiSelection = 'select'
      this.slides.lockSwipeToNext(false)
      this.slides.slideNext()
    } catch (err) {
      this.state.wifiSelection = 'error'
      this.errorMsg = err.message
      this.log.error('could not connect to wifi:', err.message)
    }
  }

  private handleCompilation () {
    this.slides.lockSwipeToNext(!this.compiledSketch)

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

  private async handleWifiSelection (force = false) {
    if (this.otaWifi.strategy === WifiStrategy.Automatic) {
      this.slides.lockSwipeToNext(true)

      // skip scan when boxes where already found from the scan on startup
      if (!force && this.availableSenseboxes.length)
        return this.state.wifiSelection = 'select'

      try {
        this.state.wifiSelection = 'scanning'
        // force update of view, as setting subproperties of this.state is not detected automatically :/
        this.changedetect.detectChanges()
        this.availableSenseboxes = await this.otaWifi.findSenseboxes(true)
        this.state.wifiSelection = 'select'
        this.changedetect.detectChanges()
      } catch (err) {
        this.errorMsg = err.message
        this.state.wifiSelection = 'error'
        this.changedetect.detectChanges()
        this.log.error('could not scan wifi:', err.message)
      }
    }
  }

  private async handleUpload () {
    this.counts.upload++
    this.state.upload = 'uploading'
    try {
      const res = await this.otaWifi.uploadFirmware(this.compiledSketch)
      this.log.debug(JSON.stringify(res, null, 2))

      this.state.upload = 'done'
      this.slides.lockSwipeToNext(false)
    } catch (err) {
      this.state.upload = 'error'
      this.errorMsg = err.message
      this.log.error('could not upload sketch:', err.message)
    }
  }

  private async compileSketch () {
    this.counts.compile++
    this.state.compilation = 'compiling'
    try {
      this.compiledSketch = await this.webcompiler.compile(this.sketch)
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
      this.log.error('could not compile sketch:', err.message)
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
  Intro2 = 1,
  Compilation = 2,
  WifiSelection = 3,
  Upload = 4,
}
