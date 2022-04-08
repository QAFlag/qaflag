import { HttpResponse } from '../models/http-response';
import { HttpRequest } from '../models/http-request';
import { HttpRequestOptions } from './http-request.interface';
import { HttpHeaders } from './http.types';

export type Fetcher = HttpRequestOptions & {
  fetch?: (request: HttpRequest) => Promise<HttpResponse>;
  parse?: (response: HttpResponse) => Promise<any>;
};

export type StringFetcher = Fetcher & {
  parse: (response: HttpResponse) => Promise<string>;
};

export type HeaderFetcher = Fetcher & {
  parse: (response: HttpResponse) => Promise<HttpHeaders>;
};
