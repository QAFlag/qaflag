import { HttpRequest } from '../models/http-request';
import { HttpResponse } from '../models/http-response';
import { Cookie } from 'tough-cookie';
import { KeyValue } from './general.types';
import { HttpRequestOptions } from './http-request.interface';
import { HttpAuth, HttpHeaders, HttpProxy } from './http.types';

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

export type PersonaSetup = {
  request: HttpRequestOptions;
  fetch?: (request: HttpRequest) => Promise<HttpResponse>;
  init: (persona: PersonaInterface, response?: HttpResponse) => Promise<void>;
};

export interface PersonaInterface {
  name: string;
  story: string | undefined;
  userAgent: string | undefined;
  browser: BrowserOptions | undefined;
  bearerToken: string | undefined;
  basicAuthentication: HttpAuth | undefined;
  proxy: HttpProxy | undefined;
  headers: HttpHeaders | undefined;
  cookies: Cookie[];
  trailers: KeyValue | undefined;
  geolocation: GeoLocation | undefined;
  isOffline: boolean;
  languageLocale: string | undefined;
  timezone: string | undefined;
  viewport: WidthAndHeight | undefined;
  screenSize: WidthAndHeight | undefined;
  deviceInputs: DeviceInput[];
  deviceType: DeviceType;
  authenticate(): Promise<this>;
}

export interface PersonaInitInterface
  extends Partial<Omit<PersonaInterface, 'authenticate' | 'cookies'>> {
  cookies?: Cookie[] | KeyValue<string>;
}
