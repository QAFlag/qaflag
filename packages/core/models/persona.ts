import { fetchWithAxios } from '../utils/axios';
import { HttpHeaders } from '../types/http.types';
import { HttpRequestInterface } from '../types/http-request.interface';
import { HttpRequest } from './http-request';
import {
  PersonaInitInterface,
  PersonaInterface,
} from '../types/persona.interface';
import { HeaderFetcher, StringFetcher } from '../types/fetcher';

export class Persona implements PersonaInterface {
  #bearerToken: string | undefined = undefined;
  #headers: HttpHeaders | undefined = undefined;

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
    return this.opts.cookies;
  }

  public get headers() {
    return this.#headers;
  }

  public get bearerToken() {
    return this.#bearerToken;
  }

  public get userAgent() {
    return this.opts.userAgent;
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

  public get isOnline(): boolean {
    return !!this.opts.isOnline;
  }

  public get name() {
    return this.opts.name;
  }

  public get story() {
    return this.opts.story;
  }

  public async authenticate(
    request: HttpRequestInterface,
  ): Promise<HttpRequestInterface> {
    // Request has no bearer token, but our persona does
    if (!request.bearerToken && this.opts.bearerToken) {
      this.#bearerToken = await this.getToken(this.opts.bearerToken);
      request.bearerToken = this.#bearerToken;
    }
    // Apply headers from persona
    this.#headers = await this.getHeaders(this.opts.headers);
    request.headers = {
      ...this.#headers,
      ...request.headers,
    };
    // Apply basic/digest auth
    if (this.opts.basicAuthentication && !request.auth) {
      request.auth = this.opts.basicAuthentication;
    }
    return request;
  }

  private async getToken(fetcher: string | StringFetcher): Promise<string> {
    if (this.#bearerToken) return this.#bearerToken;
    if (typeof fetcher == 'string') return fetcher;
    const req = new HttpRequest(fetcher);
    const res = await (fetcher.fetch === undefined
      ? fetchWithAxios(req)
      : fetcher.fetch(req));
    return fetcher.parse(res);
  }

  private async getHeaders(
    personaHeaders?: HttpHeaders | HeaderFetcher,
  ): Promise<HttpHeaders> {
    if (this.#headers) return this.#headers;
    if (!personaHeaders?.parse) return (personaHeaders as HttpHeaders) || {};
    const fetcher = personaHeaders as HeaderFetcher;
    const req = new HttpRequest(fetcher as HeaderFetcher);
    const res = await (fetcher.fetch === undefined
      ? fetchWithAxios(req)
      : fetcher.fetch(req));
    return fetcher.parse(res);
  }
}
