import { parseUri } from '../utils/uri';
import {
  HttpBody,
  HttpEncoding,
  HttpHeaders,
  HttpResponseType,
  HttpVerbs,
} from '../types/http.types';
import {
  HttpRequestOptions,
  RequestInterface,
} from '../types/request.interface';
import { ScenarioUri } from '../types/scenario.interface';

export function RequestType() {
  abstract class RequestAbstract implements RequestInterface {
    #method: HttpVerbs;
    #path: string;

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

    public get auth() {
      return this.opts.auth;
    }

    public get bearerToken() {
      return this.opts.bearerToken;
    }

    public get proxy() {
      return this.opts.proxy;
    }

    public get headers() {
      const headers = {
        ...this.opts.headers,
        'user-agent': this.userAgent,
      };
      return headers;
    }

    public set headers(headers: HttpHeaders) {
      this.opts.headers = headers;
    }

    public get responseType() {
      return this.opts.responseType || 'json';
    }

    public set responseType(type: HttpResponseType) {
      this.opts.responseType = type;
    }

    public get responseEncoding(): HttpEncoding {
      return this.opts.responseEncoding || 'utf8';
    }

    public get queryString() {
      return this.opts.queryString || {};
    }

    public get data(): HttpBody {
      return this.opts.data;
    }

    public get userAgent() {
      const ua =
        this.opts.userAgent ||
        (this.opts.headers && this.opts.headers['user-agent']) ||
        'Flagpole';
      return Array.isArray(ua) ? ua.join(' ') : ua;
    }

    public get cookies() {
      return this.opts.cookies || {};
    }

    public get timeout(): number {
      return this.opts.timeout || 10000;
    }

    public get maxRedirects(): number {
      return this.opts.maxRedirects || 5;
    }

    constructor(public readonly opts: HttpRequestOptions) {
      this.uri = opts.uri;
    }

    public pathReplace(variables: [string, any][]): void {
      let path = this.path;
      variables.forEach(([key, value]) => {
        path = path.replace(`{${key}}`, String(value));
      });
      this.path = path;
    }
  }
  return RequestAbstract;
}
