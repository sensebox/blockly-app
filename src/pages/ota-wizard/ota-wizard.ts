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

  compilationFailed: boolean

  state: OtaState = {
    isOnline: false,
    compiledSketch: undefined,
    compilation: 'compiling',
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

      case OtaSlides.Status:
        break

      default:
        console.warn('unknown slide, please define its logic')
    }
  }

  private handleCompilation () {
    this.slides.lockSwipeToNext(!this.state.compiledSketch)

    // need to go online for compilation. compilation is retriggered via this.onlineSub
    if (!this.state.compiledSketch && !this.state.isOnline) {
      switch (this.otaWifi.strategy) {
        case WifiStrategy.Automatic:
          // TODO: auto connect to previous network, if available
        default:
          this.state.compilation = 'go-online'
          break
      }
    }
  }

  private handleWifiSelection () {
    this.slides.lockSwipeToNext(true)

    console.log('wifi strategy:', this.otaWifi.strategy)
    this.otaWifi.findSenseboxes()
      .then(console.log)
      .catch(console.error)
  }

  private compileSketch () {
    // TODO: mock
    this.state.compilation = 'compiling'
    setTimeout(() => {
      this.state.compiledSketch = 'firmware binary here..'
      this.state.compilation = 'done'
      this.slides.lockSwipeToNext(false)
    }, 4000)
  }
}

type OtaState = {
  isOnline: boolean,
  compiledSketch: any,
  compilation: 'compiling' | 'go-online' | 'done' | 'error',
}

// names for the slide indices for easier access
enum OtaSlides {
  Intro = 0,
  Compilation = 1,
  WifiSelection = 2,
  Status = 3,
}
