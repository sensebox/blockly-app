import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { LOG_OPTIONS, APP_VERSION } from '../../constants';
import { StorageProvider, SETTINGS } from '../storage/storage';
import { TranslateService } from '@ngx-translate/core';

// these types must be defined here to avoid a circular dependency with LoggingProvider
export interface LogOptions {
  local: boolean | LogLevel,
  remote: boolean | LogLevel,
  endpoint: string,
}
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

@Injectable()
export class LoggingProvider {
  private opts: LogOptions = LOG_OPTIONS
  private defaultFields: any = {}

  constructor(
    private http: HttpClient,
    private plt: Platform,
    private storage: StorageProvider,
    private translate: TranslateService,
  ) {
    const { defaultFields } = this
    defaultFields.appVersion = APP_VERSION
    defaultFields.platform = this.plt.platforms().join(' ')
    defaultFields.platformVersion = this.plt.version().str
    defaultFields.lang = translate.currentLang
  }

  createChild (component: string, defaultFields: object = {}) {
    const child = new LoggingProvider(this.http, this.plt, this.storage, this.translate)
    Object.assign(child.defaultFields, defaultFields, { component })
    return child
  }

  debug (...data) { return this.log(LogLevel.DEBUG, ...data) }
  info  (...data) { return this.log(LogLevel.INFO, ...data) }
  warn  (...data) { return this.log(LogLevel.WARN, ...data) }
  error (...data) { return this.log(LogLevel.ERROR, ...data) }

  private log (level: LogLevel, ...fields: (string | object)[]): LogMessage {
    const msg = this.buildLogMessage(level, ...fields)

    if (this.opts.local !== false && level >= this.opts.local) {
      this.getLocalLogFunc(msg.level)(msg.time, msg.msg, msg)
    }

    if (this.opts.remote !== false && level >= this.opts.remote) {
      if (this.storage.get(SETTINGS).logOptin) {
        // fire & forget, no async handling as logging should not have impact on application flow
        this.http.post(this.opts.endpoint, msg, { responseType: 'text' })
          .toPromise()
          .catch(console.error)
      }
    }

    return msg
  }

  private buildLogMessage (level: LogLevel, ...fields: (string | object)[]): LogMessage {
    const logentry = { } as LogMessage
    let msg = ''

    for (const param of fields) {
      if (typeof param === 'object')
        Object.assign(logentry, param)
      else
        msg = msg ? `${msg} ${param}` : param
    }

    if (msg)
      logentry.msg = msg

    Object.assign(logentry, this.defaultFields, {
      time: Date.now(),
      level,
    })

    return logentry
  }

  private getLocalLogFunc (level: LogLevel): (...params: any[]) => any {
    switch (level) {
      case LogLevel.DEBUG:
      case LogLevel.INFO:
        return console.log

      case LogLevel.WARN:
        return console.warn

      case LogLevel.ERROR:
      default:
        return console.error
    }
  }
}

interface LogMessage {
  level: LogLevel,
  time: Date,
  app: string,
  appVersion: string,
  platform: string,
  platformVersion: string,

  component?: string,
  msg?: string,
  [k: string]: any,
}
