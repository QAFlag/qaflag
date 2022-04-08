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
import { Persona } from './persona';
import { ScenarioUri } from '../types/scenario.interface';
import { parseUri } from '../utils/uri';

export class HttpRequest implements HttpRequestInterface {
  #method: HttpVerbs;
  #path: string;

  constructor(
    public readonly opts: HttpRequestOptions,
    public readonly persona?: Persona,
  ) {
    this.uri = opts.uri;
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
    return this.#path;
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

  public pathReplace(variables: [string, any][]): void {
    let path = this.path;
    variables.forEach(([key, value]) => {
      path = path.replace(`{${key}}`, String(value));
    });
    this.path = path;
  }

  public get proxy() {
    return this.opts.proxy;
  }

  public get userAgent() {
    const ua =
      this.opts.userAgent ||
      (this.opts.headers && this.opts.headers['user-agent']) ||
      this.persona?.userAgent ||
      'Flagpole';
    return Array.isArray(ua) ? ua.join(' ') : ua;
  }

  public get cookies() {
    return this.opts.cookies || {};
  }

  public get headers() {
    const headers = {
      ...this.persona?.headers,
      ...this.opts.headers,
      'user-agent': this.userAgent,
    };
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
