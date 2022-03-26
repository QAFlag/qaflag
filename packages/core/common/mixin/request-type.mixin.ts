import { Agent } from 'http';
import tunnel = require('tunnel');
import {
  CONTENT_TYPE_JSON,
  CONTENT_TYPE_XML,
  HttpBody,
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
      return new URL(this.#path);
    }

    public get uri(): ScenarioUri {
      return `${this.#method} ${this.#path}`;
    }

    public set uri(value: ScenarioUri) {
      const uri = value.split(' ');
      this.#method = uri[0].toLowerCase() as HttpVerbs;
      this.#path = uri.slice(1).join(' ');
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
      if (!headers['Content-Type']) {
        if (this.opts.jsonBody) headers['Content-Type'] = CONTENT_TYPE_JSON;
        if (this.opts.xmlBody) headers['Content-Type'] = CONTENT_TYPE_XML;
      }
      return headers;
    }

    public get body(): HttpBody {
      return this.opts.body || this.opts.jsonBody || this.opts.xmlBody || null;
    }

    public get userAgent() {
      const ua =
        this.opts.userAgent ||
        (this.opts.headers && this.opts.headers['user-agent']) ||
        'Flagpole';
      return Array.isArray(ua) ? ua.join(' ') : ua;
    }

    public get proxyAgent(): Agent | undefined {
      if (this.opts.proxy) {
        return tunnel.httpOverHttp({
          proxy: {
            host: this.opts.proxy.host,
            port: this.opts.proxy.port,
            proxyAuth: `${this.opts.proxy.auth.username}:${this.opts.proxy.auth.password}`,
          },
        });
      }
      return undefined;
    }

    public get cookies() {
      return this.opts.cookies || {};
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
