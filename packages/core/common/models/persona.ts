import { fetchWithAxios } from '../utils/axios';
import { HttpResponse } from '../models/http-response';
import { HttpHeaders, KeyValue } from '../types/general.types';
import { HttpAuth } from '../types/http.types';
import {
  HttpRequestOptions,
  RequestInterface,
} from '../types/request.interface';
import { HttpRequest } from './http-request';

interface TokenFetch extends HttpRequestOptions {
  then: (response: HttpResponse) => Promise<string>;
}

export interface PersonaInitOpts {
  name: string;
  story?: string;
  browser?: {
    userAgent: string;
    viewport: { width: number; height: number };
  };
  bearerToken?: TokenFetch | string;
  auth?: HttpAuth;
  headers?: HttpHeaders;
  cookies?: KeyValue;
  trailers?: KeyValue;
}

export class Persona {
  #bearerToken: string | undefined = undefined;

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
      // If it's a fetch method, go get the token (but only do this once)
      if (!this.#bearerToken && typeof this.opts.bearerToken !== 'string') {
        const req = new HttpRequest(this.opts.bearerToken);
        const res = await fetchWithAxios(req);
        this.#bearerToken = await this.opts.bearerToken.then(res);
      }
      request.bearerToken = this.#bearerToken;
    }
    // Apply headers from persona
    Object.entries(this.opts.headers).forEach(([key, value]) => {
      if (!request.headers[key]) {
        request.headers[key] = value;
      }
    });
    // Apply basic/digest auth
    if (this.opts.auth && !request.auth) {
      request.auth = this.opts.auth;
    }
    return request;
  }
}
