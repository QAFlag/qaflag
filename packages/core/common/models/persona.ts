import { HttpResponse } from '../models/http-response';
import { fetchWithNeedle } from '../needle/fetch';
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
  constructor(private readonly opts: PersonaInitOpts) {}

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
      if (typeof this.opts.bearerToken == 'string') {
        request.bearerToken = this.opts.bearerToken;
      } else {
        const req = new HttpRequest(this.opts.bearerToken);
        const res = await fetchWithNeedle(req);
        request.bearerToken = await this.opts.bearerToken.then(res);
      }
    }
    // Apply headers from persona
    Object.entries(this.opts.headers).forEach(([key, value]) => {
      if (!request.headers[key]) {
        request.headers[key] = value;
      }
    });
    return request;
  }
}
