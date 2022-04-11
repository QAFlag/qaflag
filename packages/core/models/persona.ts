import { fetchWithAxios } from '../utils/axios';
import { HttpHeaders } from '../types/http.types';
import { HttpRequest } from './http-request';
import {
  DeviceInput,
  PersonaInitInterface,
  PersonaInterface,
} from '../types/persona.interface';
import { CookieFetcher, HeaderFetcher } from '../types/fetcher';
import { InputCookies } from '../utils/cookies';
import { Cookie } from 'tough-cookie';
import { KeyValue } from '../types/general.types';

export class Persona implements PersonaInterface {
  #bearerToken: string | undefined = undefined;
  #headers: HttpHeaders | undefined = undefined;
  #cookies: InputCookies | undefined = undefined;

  constructor(private readonly opts: PersonaInitInterface) {
    if (typeof opts.bearerToken == 'string') {
      this.#bearerToken = opts.bearerToken;
    }
  }

  public get timezone() {
    return this.opts.timezone;
  }

  public get trailers() {
    return this.opts.trailers;
  }

  public get cookies() {
    if (!this.#cookies) return [];
    if (Array.isArray(this.#cookies)) return this.#cookies;
    return Object.entries(this.#cookies).map(cookie => {
      return new Cookie({
        key: cookie[0],
        value: cookie[1],
      });
    });
  }

  public get headers() {
    return this.#headers || {};
  }

  public get bearerToken() {
    return this.#bearerToken;
  }

  public get userAgent() {
    return this.opts.userAgent || 'QA Flag';
  }

  public get browser() {
    return this.opts.browser;
  }

  public get viewport() {
    return this.opts.viewport;
  }

  public get screenSize() {
    return this.opts.screenSize;
  }

  public get proxy() {
    return this.opts.proxy;
  }

  public get languageLocale() {
    return this.opts.languageLocale;
  }

  public get basicAuthentication() {
    return this.opts.basicAuthentication;
  }

  public get geolocation() {
    return this.opts.geolocation;
  }

  public get name() {
    return this.opts.name;
  }

  public get story() {
    return this.opts.story;
  }

  public get deviceInputs(): DeviceInput[] {
    if (this.opts.deviceInputs) return this.opts.deviceInputs;
    if (this.isMobile) return ['keyboard', 'touch'];
    return ['keyboard', 'mouse'];
  }

  public get isMobile() {
    return ['phone', 'tablet'].includes(this.deviceType);
  }

  public get deviceType() {
    return this.opts.deviceType || 'laptop';
  }

  public get isOffline() {
    return this.opts.isOffline || false;
  }

  public async authenticate(): Promise<this> {
    this.#bearerToken = await this.fetchBearerToken();
    this.#headers = await this.fetchHeaders();
    this.#cookies = await this.fetchCookies();
    return this;
  }

  private async fetchBearerToken(): Promise<string | undefined> {
    const bearerToken = this.opts.bearerToken;
    if (this.#bearerToken) return this.#bearerToken;
    if (typeof bearerToken == 'string' || !bearerToken) return bearerToken;
    const req = new HttpRequest(bearerToken);
    const res = await (bearerToken.fetch === undefined
      ? fetchWithAxios(req)
      : bearerToken.fetch(req));
    return bearerToken.parse(res);
  }

  private async fetchHeaders(): Promise<HttpHeaders> {
    const headers = this.opts.headers;
    if (this.#headers) return this.#headers;
    if (!headers?.parse) return (headers as HttpHeaders) || {};
    const fetcher = headers as HeaderFetcher;
    const req = new HttpRequest(fetcher);
    const res = await (fetcher.fetch === undefined
      ? fetchWithAxios(req)
      : fetcher.fetch(req));
    return fetcher.parse(res);
  }

  private async fetchCookies(): Promise<InputCookies> {
    const cookies = this.opts.cookies;
    if (this.#cookies) return this.#cookies;
    if (Array.isArray(cookies)) return cookies;
    if (!cookies?.parse) return (cookies as KeyValue<string>) || {};
    const fetcher = cookies as CookieFetcher;
    const req = new HttpRequest(fetcher);
    const res = await (fetcher.fetch === undefined
      ? fetchWithAxios(req)
      : fetcher.fetch(req));
    return fetcher.parse(res);
  }
}
