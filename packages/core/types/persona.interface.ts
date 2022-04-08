import { Cookie } from 'tough-cookie';
import { HeaderFetcher, StringFetcher } from './fetcher';
import { KeyValue } from './general.types';
import { HttpRequestInterface } from './http-request.interface';
import { HttpAuth, HttpHeaders, HttpProxy } from './http.types';

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

type GeoLocation = {
  latitude: number;
  longitude: number;
  accuracy: number | undefined;
};

type ColorSchemePreference = null | 'light' | 'dark' | 'no-preference';
type ForcedColors = null | 'active' | 'none';
type MediaType = null | 'screen' | 'print';
type ReducedMotion = null | 'reduce' | 'no-preference';
type WidthAndHeight = { width: number; height: number };

type StorageOrigins = {
  origin: string;
  localStorage: {
    name: string;
    value: string;
  }[];
};

type BrowserOptions = {
  colorScheme?: ColorSchemePreference;
  forcedColors?: ForcedColors;
  mediaType?: MediaType;
  reducedMotion?: ReducedMotion;
  deviceScaleFactor?: number;
  hasTouch?: boolean;
  isMobile?: boolean;
  javaScriptEnabled?: boolean;
  storage?: StorageOrigins[];
  permissions?: Permission[];
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
  cookies: KeyValue | Cookie[] | undefined;
  trailers: KeyValue | undefined;
  geolocation: GeoLocation | undefined;
  isOnline: boolean | undefined;
  languageLocale: string | undefined;
  timezone: string | undefined;
  viewport: WidthAndHeight | undefined;
  screenSize: WidthAndHeight | undefined;
  authenticate(request: HttpRequestInterface): Promise<HttpRequestInterface>;
}

export interface PersonaInitInterface
  extends Partial<
    Omit<PersonaInterface, 'authenticate' | 'headers' | 'bearerToken' | 'name'>
  > {
  name: string;
  headers?: HttpHeaders | HeaderFetcher | undefined;
  bearerToken?: string | StringFetcher | undefined;
}
