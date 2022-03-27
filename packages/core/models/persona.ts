import { fetchWithAxios } from '../utils/axios';
import { HttpResponse } from '../models/http-response';
import { KeyValue } from '../types/general.types';
import { HttpAuth, HttpHeaders } from '../types/http.types';
import {
  HttpRequestOptions,
  RequestInterface,
} from '../types/request.interface';
import { HttpRequest } from './http-request';

type Fetcher = HttpRequestOptions & {
  fetch?: (request: HttpRequest) => Promise<HttpResponse>;
  parse?: (response: HttpResponse) => Promise<any>;
};

type StringFetcher = Fetcher & {
  parse: (response: HttpResponse) => Promise<string>;
};
type HeaderFetcher = Fetcher & {
  parse: (response: HttpResponse) => Promise<HttpHeaders>;
};

export interface PersonaInitOpts {
  name: string;
  story?: string;
  browser?: {
    userAgent: string;
    viewport: { width: number; height: number };
  };
  bearerToken?: string | StringFetcher;
  auth?: HttpAuth;
  headers?: HttpHeaders | HeaderFetcher;
  cookies?: KeyValue;
  trailers?: KeyValue;
}

export class Persona {
  #bearerToken: string | undefined = undefined;
  #headers: HttpHeaders | undefined = undefined;

  constructor(private readonly opts: PersonaInitOpts) {
    if (typeof opts.bearerToken == 'string') {
      this.#bearerToken = opts.bearerToken;
    }
  }

  public get name() {
    return this.opts.name;
  }

  public get story() {
    return this.opts.story;
  }

  public async authenticate(
    request: RequestInterface,
  ): Promise<RequestInterface> {
    // Request has no bearer token, but our persona does
    if (!request.bearerToken && this.opts.bearerToken) {
      // If we haven't gotten token yet, go get it
      if (!this.#bearerToken) {
        this.#bearerToken = await this.getToken(this.opts.bearerToken);
      }
      request.bearerToken = this.#bearerToken;
    }
    // Apply headers from persona
    request.headers = {
      ...(await this.getHeaders(this.opts.headers)),
      ...request.headers,
    };
    // Apply basic/digest auth
    if (this.opts.auth && !request.auth) {
      request.auth = this.opts.auth;
    }
    return request;
  }

  private async getToken(fetcher: string | StringFetcher): Promise<string> {
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
    this.#headers = await fetcher.parse(res);
    return this.#headers;
  }
}
