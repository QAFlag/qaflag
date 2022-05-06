import { PersonaInitOptions, PersonaInterface } from './persona.interface';
import { Cookie } from 'tough-cookie';
import { BeforeSymbol } from '../decorators/before.decorator';
import { shallowMerge } from '../utils/helpers';
import { SuiteInterface } from '../suite/suite.interface';
import { HttpRequestOptions } from '../types/http-request.interface';

export const Persona = (
  name: string,
  ...aboutThisUser: PersonaInitOptions[]
) => {
  const qualities = shallowMerge<PersonaInitOptions>({}, ...aboutThisUser);

  return class implements PersonaInterface {
    #hasStarted: boolean = false;
    #viewportSize = qualities.viewportSize;

    public readonly name = name;
    public gender = qualities.gender;
    public age = qualities.age;
    public occupation = qualities.occupation;
    public geolocation = qualities.geolocation;
    public timezone = qualities.timezone;
    public language = qualities.language;
    public disabilities = qualities.disabilities || [];
    public bearerToken = qualities.bearerToken;
    public basicAuthentication = qualities.basicAuthentication;
    public proxy = qualities.proxy;
    public headers = qualities.headers || [];
    public trailers = qualities.trailers || [];
    public deviceType = qualities.deviceType || 'laptop';
    public deviceInputs = qualities.deviceInputs || ['keyboard', 'mouse'];
    public deviceOutputs = qualities.deviceOutputs || ['screen'];
    public isPortraitMode: boolean = qualities.isPortraitMode || false;
    public connectionType = qualities.connectionType || 'wifi';
    public colorScheme = qualities.colorScheme || 'light';
    public browser = {
      product: qualities.browser?.product || 'chrome',
      userAgent: qualities.browser?.userAgent || undefined,
      executablePath: qualities.browser?.executablePath || undefined,
      deviceScaleFactor: qualities.browser?.deviceScaleFactor || 1,
      javaScriptEnabled: qualities.browser?.javaScriptEnabled || true,
      permissions: qualities.browser?.permissions || undefined,
      localStorage: qualities.browser?.localStorage || undefined,
      userPreferences: qualities.browser?.userPreferences || undefined,
    };
    public os = qualities.os || {};
    public screenSize = qualities.screenSize || [1280, 720];

    public get cookies() {
      if (!qualities.cookies) return [];
      if (Array.isArray(qualities.cookies)) {
        return qualities.cookies;
      }
      return Object.entries(qualities.cookies).map(cookie => {
        return new Cookie({
          key: cookie[0],
          value: String(cookie[1]),
        });
      });
    }

    public get viewportSize() {
      return this.#viewportSize || this.screenSize;
    }

    public set viewportSize(value: [number, number]) {
      this.#viewportSize = value;
    }

    public async __startUp(suite: SuiteInterface): Promise<void> {
      if (!this[BeforeSymbol] || this.#hasStarted) return;
      const opts: Partial<HttpRequestOptions> = {
        baseUrl: suite.baseUrl,
        pathArgs: suite.store.entries(),
      };
      const befores = Object.values<Function>(this[BeforeSymbol] || {});
      await Promise.all(befores.map(async before => before(this, opts)));
      this.#hasStarted = true;
    }
  };
};

export class DefaultUser extends Persona('Default') {}
