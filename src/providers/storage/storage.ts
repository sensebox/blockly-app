import { Injectable } from '@angular/core';

export const SETTINGS = 'appsettings'
export const LASTSKETCH = 'lastsketch'

@Injectable()
export class StorageProvider {
  private cache: Map<string, any> = new Map()

  constructor () {
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
}
