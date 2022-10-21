import { SuiteInterface } from '../suite/suite.interface';
import { Cookie } from 'tough-cookie';
import { KeyValue } from '../types/general.types';
import { HttpAuth, HttpHeaders, HttpProxy } from '../types/http.types';

export type DeviceType =
  | 'phone'
  | 'tablet'
  | 'desktop'
  | 'laptop'
  | 'tv'
  | 'speaker';
export type DeviceInput =
  | 'touch'
  | 'mouse'
  | 'keyboard'
  | 'microphone'
  | 'remote';
export type DeviceOutput = 'screen' | 'printer' | 'speaker';

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

export type Disabilities =
  | 'hearing-impaired'
  | 'vision-impaired'
  | 'color-blind'
  | 'motion-disorder';

export type GeoLocation = {
  latitude: number;
  longitude: number;
  accuracy: number | undefined;
};

export type ColorScheme = 'light' | 'dark' | undefined;
export type XY = [number, number];

export type StorageOrigins = {
  origin: string;
  storage: {
    name: string;
    value: string;
  }[];
};

export type BrowserSoftware = 'chrome' | 'firefox' | 'safari' | 'msedge';

export interface PersonaWebBrowser {
  product?: BrowserSoftware | undefined;
  userAgent?: string | undefined;
  executablePath?: string | undefined;
  deviceScaleFactor?: number | undefined;
  javaScriptEnabled?: boolean | undefined;
  permissions?: Permission[] | undefined;
  localStorage?: StorageOrigins[] | undefined;
  userPreferences?: { [key: string]: string | number | boolean } | undefined;
}

export type OperatingSystemType =
  | 'windows'
  | 'mac'
  | 'linux'
  | 'unix'
  | 'osx'
  | 'android'
  | 'ios'
  | 'chromeos';

export interface PersonaOperatingSystem {
  type?: OperatingSystemType | undefined;
}

export interface PersonaQualities {
  // Attributes
  gender: 'male' | 'female' | undefined;
  age: number | undefined;
  occupation: string | undefined;
  timezone: string | undefined;
  language: string | undefined;
  disabilities: Disabilities[];
  geolocation: GeoLocation | undefined;
  // Device
  deviceType: DeviceType;
  deviceInputs: DeviceInput[];
  deviceOutputs: DeviceOutput[];
  browser: PersonaWebBrowser;
  os: PersonaOperatingSystem;
  screenSize: XY;
  viewportSize: XY;
  isPortraitMode: boolean;
  // Connection
  connectionType: 'offline' | '2g' | '3g' | '4g' | '5g' | 'wifi' | 'wired';
  proxy: HttpProxy | undefined;
  bearerToken: string | undefined;
  basicAuthentication: HttpAuth | undefined;
  headers: HttpHeaders;
  trailers: HttpHeaders;
  cookies: Cookie[];
  // Perferences
  colorScheme: ColorScheme;
  // Helpers
  readonly hasMouse: boolean;
  readonly hasTouch: boolean;
  readonly hasRemote: boolean;
  readonly hasKeyboard: boolean;
  readonly hasMicrophone: boolean;
  readonly hasPrinter: boolean;
  readonly hasScreen: boolean;
  readonly hasSpeaker: boolean;
}

export type PersonaInitOptions = Partial<PersonaQualities>;

export interface PersonaInterface extends PersonaQualities {
  __startUp(suite: SuiteInterface): Promise<void>;
  name: string;
}
