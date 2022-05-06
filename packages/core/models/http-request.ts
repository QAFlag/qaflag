import {
  HttpBody,
  HttpEncoding,
  HttpHeaders,
  HttpResponseType,
  HttpVerbs,
} from '../types/http.types';
import {
  HttpRequestInterface,
  HttpRequestOptions,
} from '../types/http-request.interface';
import { ScenarioUri } from '../scenario/scenario.interface';
import { parseUri } from '../utils/uri';
import { getCookieArray } from '../utils/cookies';
import { Cookie } from 'tough-cookie';
import { PersonaInterface } from '../persona/persona.interface';
import { DefaultUser } from '../persona/persona';

export class HttpRequest implements HttpRequestInterface {
  #method: HttpVerbs = 'get';
  #path: string = '/';
  #persona: PersonaInterface | undefined;

  constructor(
    public readonly opts: HttpRequestOptions,
    persona?: PersonaInterface,
  ) {
    this.uri = opts.uri;
    this.#persona = persona;
  }

  public get responseType() {
    return this.opts.responseType || 'json';
  }

  public set responseType(type: HttpResponseType) {
    this.opts.responseType = type;
  }

  public get url(): URL {
    return new URL(this.#path, this.baseUrl);
  }

  public get uri(): ScenarioUri {
    return `${this.#method} ${this.#path}`;
  }

  public set uri(value: ScenarioUri) {
    const uri = parseUri(value);
    this.#method = uri.method;
    this.#path = uri.path;
  }

  public get method() {
    return this.#method;
  }

  public set method(value: HttpVerbs) {
    this.#method = value;
  }

  public get path(): string {
    if (!this.opts.pathArgs) return this.#path;
    let path = this.#path;
    Object.entries(this.opts.pathArgs).forEach(([key, value]) => {
      path = path.replace(`{${key}}`, String(value));
    });
    return path;
  }

  public set path(value: string) {
    this.#path = value;
  }

  public get baseUrl() {
    return this.opts.baseUrl;
  }

  public get timeout(): number {
    return this.opts.timeout || 10000;
  }

  public set persona(persona: PersonaInterface) {
    this.#persona = persona;
  }

  public get persona() {
    return this.#persona || new DefaultUser();
  }

  public get pathArgs(): [string, any][] {
    return this.opts.pathArgs || [];
  }

  public set pathArgs(value: [string, any][]) {
    this.opts.pathArgs = value;
  }

  public get proxy() {
    return this.opts.proxy || this.persona?.proxy;
  }

  public get userAgent() {
    return (
      this.opts.userAgent ||
      (this.opts.headers && this.opts.headers['user-agent']) ||
      'QA Flag'
    );
  }

  public get cookies(): Cookie[] {
    return [
      ...getCookieArray(this.persona?.cookies),
      ...getCookieArray(this.opts.cookies),
    ];
  }

  public get headers() {
    const headers = [
      ...(this.persona?.headers || []),
      ...(this.opts.headers || []),
      { key: 'user-agent', value: this.userAgent },
    ];
    return headers;
  }

  public set headers(headers: HttpHeaders) {
    this.opts.headers = headers;
  }

  public get bearerToken() {
    return this.opts.bearerToken || this.persona?.bearerToken;
  }

  public get auth() {
    return this.opts.auth || this.persona?.basicAuthentication;
  }

  public get maxRedirects(): number {
    return this.opts.maxRedirects || 5;
  }

  public get data(): HttpBody {
    return this.opts.data || null;
  }

  public get responseEncoding(): HttpEncoding {
    return this.opts.responseEncoding || 'utf8';
  }

  public get queryString() {
    return this.opts.queryString || {};
  }
}
