import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OtaWizardPage } from '../ota-wizard/ota-wizard';

@IonicPage()
@Component({
  selector: 'page-blockly',
  templateUrl: 'blockly.html',
})
export class BlocklyPage {
  @ViewChild('blocklyFrame') blocklyFrame: ElementRef

  messageHandler: (ev: IframePostMessageEvent) => void

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
    // need to assign it here to keep the function reference for unsubscribing again
    // and to maintain the this scope properly
    this.messageHandler = (ev: IframePostMessageEvent) => {
      const { type, data } = ev.data;
      switch (type) {
        case 'sketch':
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
    this.blocklyFrame.nativeElement.contentWindow.postMessage('getSketch', '*')
  }

  toggleView () {
    this.blocklyFrame.nativeElement.contentWindow.postMessage('toggleView', '*')
  }
}

interface IframePostMessageEvent extends MessageEvent {
  data: {
    type: 'sketch',
    data: any,
  }
}
