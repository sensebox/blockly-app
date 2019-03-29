import { ElementRef } from '@angular/core';
import { LoggingProvider } from '../../providers/logging/logging';

/**
 * this file defines & implements the message passing protocol to communicate
 * with an iframe that has src/assets/blockly.html loaded.
 * The underlying postMessage protocol is wrapped into a promise API.
 */

export class BlocklyMessageProtocol {
  ready: Promise<void>

  // defines the expected response type for each request type
  private reqResPatterns: BlocklyReqPatterns = {
    'getSketch': 'sketch',
    'getXml': 'xml',
    'setXml': null,
    'toggleView': null,
  }

  constructor (private blocklyFrame: ElementRef, private log: LoggingProvider) {
    // set up event listeners for non-request log messages
    window.addEventListener('message', (ev: IframePostMessageEvent) => {
      if (ev.data.type === 'log')
        this.log.warn('log entry from blockly:', ev.data)
      else
        this.log.debug(`received ${ev.data.type} message from blockly`, { message: ev.data })
    })

    // resolve ready promise once the blocklyFrame is ready
    this.ready = new Promise(resolve => {
      window.addEventListener('message', (ev: IframePostMessageEvent) => {
        // @HACK @FIXME: timeout is required, as blockly resolves some async functions
        // after firing the `ready` event..
        if (ev.data.type === 'ready') setTimeout(resolve, 300)
      })
    })
  }

  toggleView() { this.sendRequest({ type: 'toggleView' }) }
  setXml(data: string) { this.sendRequest({ type: 'setXml', data }) }

  getXml() { return this.sendRequest({ type: 'getXml' }) }
  getSketch() { return this.sendRequest({ type: 'getSketch' }) }

  private async sendRequest(req: BlocklyRequest): Promise<any> {
    await this.ready

    if (
      !this.blocklyFrame ||
      !this.blocklyFrame.nativeElement &&
      !this.blocklyFrame.nativeElement.contentWindow
    ) {
      throw Error('cannot access blockly frame')
    }

    const expectResponse = this.reqResPatterns[req.type]
    this.log.debug(`sending ${req.type} message to blockly, expecting response: ${expectResponse}`, { message: req })

    if (!expectResponse)
      return this.blocklyFrame.nativeElement.contentWindow.postMessage(req, '*')

    // create promise waiting for the response event
    const resPromise = new Promise<any>((resolve, reject) => {
      const resHandler = ({ data: res }: IframePostMessageEvent) => {
        if (expectResponse !== res.type) return
        window.removeEventListener('message', resHandler)
        if (expectResponse === 'error') reject(res.data)
        else resolve(res.data)
      }
      // TODO: promise reject after timeout?
      window.addEventListener('message', resHandler)
    })

    // send message after registering the subscribe handler!
    this.blocklyFrame.nativeElement.contentWindow.postMessage(req, '*')
    return resPromise
  }
}

interface IframePostMessageEvent extends MessageEvent {
  data: BlocklyResponse
}

type BlocklyReqPatterns = {
  [k in BlocklyRequest['type']]: BlocklyResponse['type']
}

type BlocklyRequest =
  { type: 'getSketch' } |
  { type: 'getXml' } |
  { type: 'setXml', data: string } |
  { type: 'toggleView' }

type BlocklyResponse =
  { type: 'log', data: any } |
  { type: 'error', data: any } |
  { type: 'ready', data: undefined } |
  { type: 'sketch', data: string } |
  { type: 'xml', data: string }
