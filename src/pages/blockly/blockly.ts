import { Component, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { OtaWizardPage } from '../ota-wizard/ota-wizard';
import { LoggingProvider } from '../../providers/logging/logging';

@IonicPage()
@Component({
  selector: 'page-blockly',
  templateUrl: 'blockly.html',
})
export class BlocklyPage {
  @ViewChild('blocklyFrame') blocklyFrame: ElementRef
  blocklyUrl: SafeResourceUrl

  private messageHandler: (ev: IframePostMessageEvent) => void
  private log: LoggingProvider

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private sanitizer: DomSanitizer,
    logger: LoggingProvider,
    translate: TranslateService,
  ) {
    this.log = logger.createChild('BlocklyPage')
    this.blocklyUrl = this.buildBlocklyUrl(translate.currentLang)

    // need to assign it here to keep the function reference for unsubscribing again
    // and to maintain the this scope properly
    this.messageHandler = (ev: IframePostMessageEvent) => {
      const { type, data } = ev.data;
      switch (type) {
        case 'sketch':
          this.log.debug('sketch received, launching ota wizard page', { sketch: data })
          this.navCtrl.push(OtaWizardPage, { sketch: data })
          break
        default:
      }
    }

    window.addEventListener('message', this.messageHandler)
  }

  ionViewWillUnload () {
    window.removeEventListener('message', this.messageHandler)
  }

  launchOtaWizard () {
    this.log.debug('clicked launch ota')
    this.blocklyFrame.nativeElement.contentWindow.postMessage('getSketch', '*')
  }

  toggleView () {
    this.log.debug('clicked toggle view')
    this.blocklyFrame.nativeElement.contentWindow.postMessage('toggleView', '*')
  }

  buildBlocklyUrl (lang: string): SafeResourceUrl {
    if (!lang) this.log.error('building url with empty language!')
    const url = `./assets/blockly.html?lang=${lang}`
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }
}

interface IframePostMessageEvent extends MessageEvent {
  data: {
    type: 'sketch',
    data: any,
  }
}
