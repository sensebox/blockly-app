import { Injectable } from '@angular/core';

export const SETTINGS = 'appsettings'
export const LASTSKETCH = 'lastsketch'

@Injectable()
export class StorageProvider {
  private cache: Map<string, any> = new Map()

  constructor () {
    this.init()
  }

  init () {
    // set up default values
    this.registerKey(SETTINGS, { logOptin: false })
    this.registerKey(LASTSKETCH, '')
  }

  registerKey (key, defaultValue) {
    const stored = localStorage.getItem(key)
    if (stored === null) {
      this.set(key, defaultValue)
    } else {
      this.cache[key] = JSON.parse(stored)
    }
  }

  get (key) { return this.cache[key] }

  set (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
    this.cache[key] = value
  }

  reset () {
    localStorage.clear()
    this.cache = new Map()
    this.init()
  }
}
