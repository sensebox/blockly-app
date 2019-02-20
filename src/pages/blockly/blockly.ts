import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { OtaWizardPage } from '../ota-wizard/ota-wizard';
import { LoggingProvider } from '../../providers/logging/logging';
import { StorageProvider, LASTSKETCH } from '../../providers/storage/storage';
import { BlocklyMessageProtocol } from './blockly_protocol';

@IonicPage()
@Component({
  selector: 'page-blockly',
  templateUrl: 'blockly.html',
})
export class BlocklyPage implements OnInit {
  @ViewChild('blocklyFrame') blocklyFrame: ElementRef
  blocklyUrl: SafeResourceUrl
  blockly: BlocklyMessageProtocol

  private log: LoggingProvider

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private sanitizer: DomSanitizer,
    private platform: Platform,
    private storage: StorageProvider,
    logger: LoggingProvider,
    translate: TranslateService,
  ) {
    this.log = logger.createChild('BlocklyPage')
    this.blocklyUrl = this.buildBlocklyUrl(translate.currentLang)
  }

  async ngOnInit () {
    // blocklyFrame is available from here on
    this.blockly = new BlocklyMessageProtocol(this.blocklyFrame, this.log)
    await this.blockly.ready
    // load the last sketch
    const xml = this.storage.get(LASTSKETCH)
    if (xml) this.blockly.setXml(xml)

    // save state when exiting (on mobile & browsers separately)
    this.platform.pause.subscribe(() => this.saveBlocklyState())
    window.addEventListener('beforeunload', () => this.saveBlocklyState())
  }

  async ionViewCanLeave () {
    // hold closing the page until we saved the current blockly state
    await this.saveBlocklyState()
    return true
  }

  async saveBlocklyState () {
    const xml = await this.blockly.getXml()
    this.storage.set(LASTSKETCH, xml)
  }

  async launchOtaWizard () {
    const sketch = await this.blockly.getSketch()
    this.navCtrl.push(OtaWizardPage, { sketch })
  }

  private buildBlocklyUrl (lang: string): SafeResourceUrl {
    if (!lang) this.log.error('building url with empty language!')
    const url = `./assets/blockly.html?lang=${lang}`
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }
}
