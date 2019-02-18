import { LogLevel, LogOptions } from "./providers/logging/logging";

export const APP_VERSION = '1.1.0'
export const COLORS = {
  PRIMARY: '#4EAF47', // sensebox green
}
export const DEFAULT_LANG = 'en'
export const LOG_OPTIONS: LogOptions = {
  local: LogLevel.INFO,
  remote: LogLevel.WARN,
  endpoint: 'https://logs.snsbx.nroo.de/log',
}
