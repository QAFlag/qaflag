import { Cookie } from 'tough-cookie';
import { KeyValue } from '../types/general.types';
import { HttpAuth, HttpHeaders, HttpProxy } from '../types/http.types';
import { PersonaAuthenticateOpts } from './persona';

export type DeviceInput = 'touch' | 'mouse' | 'keyboard';
export type DeviceType = 'phone' | 'tablet' | 'desktop' | 'laptop';

export type Cookies = KeyValue<string> | Cookie[];

export type Permission =
  | 'geolocation'
  | 'midi'
  | 'midi-sysex'
  | 'notifications'
  | 'camera'
  | 'microphone'
  | 'background-sync'
  | 'ambient-light-sensor'
  | 'accelerometer'
  | 'gyroscope'
  | 'magnetometer'
  | 'accessibility-events'
  | 'clipboard-read'
  | 'clipboard-write'
  | 'payment-handler';

export type GeoLocation = {
  latitude: number;
  longitude: number;
  accuracy: number | undefined;
};

type ColorSchemePreference = undefined | 'light' | 'dark' | 'no-preference';
type ForcedColors = undefined | 'active' | 'none';
type MediaType = undefined | 'screen' | 'print';
type ReducedMotion = undefined | 'reduce' | 'no-preference';
export type WidthAndHeight = { width: number; height: number };

type StorageOrigins = {
  origin: string;
  localStorage: {
    name: string;
    value: string;
  }[];
};

export type BrowserOptions = {
  engine?: 'chromium' | 'firefox' | 'webkit';
  // "chrome", "chrome-beta", "chrome-dev", "chrome-canary", "msedge",  "msedge-beta", "msedge-dev", "msedge-canary"
  channel?: string;
  args?: Array<string>;
  chromiumSandbox?: boolean;
  devtools?: boolean;
  executablePath?: string;
  userPrefs?: { [key: string]: string | number | boolean };
  colorScheme?: ColorSchemePreference;
  forcedColors?: ForcedColors;
  mediaType?: MediaType;
  reducedMotion?: ReducedMotion;
  deviceScaleFactor?: number;
  javaScriptEnabled?: boolean;
  storage?: StorageOrigins[];
  permissions?: Permission[];
};

export interface PersonaInitInterface {}

export interface PersonaInterface {
  name: string;
  story?: string;
  bearerToken?: string;
  basicAuthentication?: HttpAuth;
  proxy?: HttpProxy;
  headers: HttpHeaders;
  trailers: HttpHeaders;
  cookies: Cookie[];
  device: DeviceType;
  viewport?: WidthAndHeight;
  screenSize?: WidthAndHeight;
  browser?: BrowserOptions;
  userAgent?: string;
  languageLocale?: string;
  hasJavaScript?: boolean;
  hasInternetConnection?: boolean;
  hasTouch?: boolean;
  hasKeyboard?: boolean;
  hasMouse?: boolean;
  geolocation?: GeoLocation;
  timezone?: string;
  __startUp(opts: PersonaAuthenticateOpts): Promise<void>;
}
