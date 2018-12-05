import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OtaWizardPage } from '../ota-wizard/ota-wizard';


@IonicPage()
@Component({
  selector: 'page-blockly',
  templateUrl: 'blockly.html',
})
export class BlocklyPage implements OnInit{
  @ViewChild('blocklyFrame') blocklyFrame: ElementRef

  ngOnInit() {   }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    window.addEventListener('message', ev => {
      const { type, data } = ev.data;
      switch (type) {
        case 'sketch':
          this.navCtrl.push(OtaWizardPage, { sketch: data })
          break
        default:
      }
    })
  }

  launchOtaWizard () {
    this.blocklyFrame.nativeElement.contentWindow.postMessage('getSketch', '*')
  }
}
