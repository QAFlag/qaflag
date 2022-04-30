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

export const Persona = (name: string, opts: PersonaInitInterface = {}) => {
  return class implements PersonaInterface {
    #cookies: Cookie[] | KeyValue<string> = opts.cookies || [];
    #deviceInputs: DeviceInput[] | undefined = opts.deviceInputs;
    #userAgent: string | undefined = opts.userAgent;
    public name: string = name;
    public story: string | undefined = opts.story;
    public browser: BrowserOptions | undefined;
    public bearerToken: string | undefined = opts.bearerToken;
    public basicAuthentication: HttpAuth | undefined = opts.basicAuthentication;
    public proxy: HttpProxy | undefined = opts.proxy;
    public headers: HttpHeaders = opts.headers || {};
    public trailers: KeyValue<string> = opts.trailers || {};
    public geolocation: GeoLocation | undefined = opts.geolocation;
    public isOffline: boolean = opts.isOffline || false;
    public languageLocale: string | undefined = opts.languageLocale;
    public timezone: string | undefined = opts.timezone;
    public viewport: WidthAndHeight | undefined = opts.viewport;
    public screenSize: WidthAndHeight | undefined = opts.screenSize;
    public deviceType: DeviceType = opts.deviceType || 'laptop';

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

    public async authenticate(
      opts: PersonaAuthenticateOpts = {},
    ): Promise<this> {
      // TODO: Fix authenticate back up to fetch details. Make sure we only do it once
      return this;
    }
  };
};
