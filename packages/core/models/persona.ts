import {
  BrowserOptions,
  DeviceInput,
  DeviceType,
  GeoLocation,
  PersonaInitInterface,
  PersonaInterface,
  WidthAndHeight,
} from '../types/persona.interface';
import { Cookie } from 'tough-cookie';
import { HttpAuth, HttpHeaders, HttpProxy } from '../types/http.types';
import { KeyValue } from '../types/general.types';

export interface PersonaAuthenticateOpts {
  baseUrl?: string;
}

export class Persona implements PersonaInterface {
  #cookies: Cookie[] | KeyValue<string>;
  #deviceInputs: DeviceInput[] | undefined;
  #userAgent: string | undefined;

  constructor(opts: PersonaInitInterface) {
    this.name = opts.name || 'Default';
    this.story = opts.story;
    this.#userAgent = opts.userAgent;
    this.bearerToken = opts.bearerToken;
    this.basicAuthentication = opts.basicAuthentication;
    this.proxy = opts.proxy;
    this.headers = opts.headers || {};
    this.#cookies = opts.cookies || [];
    this.trailers = opts.trailers || {};
    this.geolocation = opts.geolocation;
    this.isOffline = opts.isOffline || false;
    this.languageLocale = opts.languageLocale;
    this.timezone = opts.timezone;
    this.viewport = opts.viewport;
    this.screenSize = opts.screenSize;
    this.deviceType = opts.deviceType || 'laptop';
    this.#deviceInputs = opts.deviceInputs;
  }

  public name: string;
  public story: string | undefined;
  public browser: BrowserOptions | undefined;
  public bearerToken: string | undefined;
  public basicAuthentication: HttpAuth | undefined;
  public proxy: HttpProxy | undefined;
  public headers: HttpHeaders;
  public trailers: KeyValue<string>;
  public geolocation: GeoLocation | undefined;
  public isOffline: boolean;
  public languageLocale: string | undefined;
  public timezone: string | undefined;
  public viewport: WidthAndHeight | undefined;
  public screenSize: WidthAndHeight | undefined;
  public deviceType: DeviceType;

  public get userAgent(): string {
    if (this.#userAgent) return this.#userAgent;
    if (this.headers['user-agent']) return this.headers['user-agent'];
    return 'QA Flag';
  }

  public get deviceInputs(): DeviceInput[] {
    if (this.#deviceInputs) return this.#deviceInputs;
    return this.isMobile ? ['keyboard', 'touch'] : ['keyboard', 'mouse'];
  }

  public get isMobile() {
    return ['phone', 'tablet'].includes(this.deviceType);
  }

  public get cookies() {
    if (Array.isArray(this.#cookies)) return this.#cookies;
    return Object.entries(this.#cookies).map(cookie => {
      return new Cookie({
        key: cookie[0],
        value: cookie[1],
      });
    });
  }

  public async authenticate(opts: PersonaAuthenticateOpts = {}): Promise<this> {
    // TODO: Fix authenticate back up to fetch details. Make sure we only do it once
    return this;
  }
}
