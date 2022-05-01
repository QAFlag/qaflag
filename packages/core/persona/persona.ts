import { PersonaInitInterface, PersonaInterface } from './persona.interface';
import { Cookie } from 'tough-cookie';
import { HttpAuth, HttpHeaders, HttpProxy } from '../types/http.types';
import { KeyValue } from '../types/general.types';
import { BeforeSymbol } from '../decorators/before.decorator';

export interface PersonaAuthenticateOpts {
  baseUrl?: string;
}

export const Persona = (name: string, opts: PersonaInitInterface = {}) => {
  return class implements PersonaInterface {
    #hasStarted: boolean = false;
    #cookies: Cookie[] | KeyValue<string> = [];
    public name: string = name;
    public story: string | undefined;
    public bearerToken: string | undefined;
    public basicAuthentication: HttpAuth | undefined;
    public proxy: HttpProxy | undefined;
    public headers: HttpHeaders = {};
    public trailers: KeyValue<string> = {};
    public device: 'laptop';
    public viewport: undefined;
    public screenSize: undefined;
    public browser: undefined;
    public languageLocale: undefined;
    public hasJavaScript: true;
    public hasInternetConnection: true;
    public hasTouch: false;
    public hasKeyboard: true;
    public hasMouse: true;
    public geolocation: undefined;
    public timezone: undefined;

    public get userAgent(): string {
      return this.headers['user-agent'];
    }

    public set userAgent(ua: string) {
      this.headers['user-agent'] = ua;
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

    public async __startUp(opts: PersonaAuthenticateOpts = {}): Promise<void> {
      if (!this[BeforeSymbol] || this.#hasStarted) return;
      const befores = Object.values<Function>(this[BeforeSymbol] || {});
      await Promise.all(befores.map(async before => before(this, opts)));
      this.#hasStarted = true;
    }
  };
};
