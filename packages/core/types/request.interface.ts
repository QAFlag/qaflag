import { KeyValue } from './general.types';
import {
  HttpAuth,
  HttpBody,
  HttpEncoding,
  HttpHeaders,
  HttpProxy,
  HttpResponseType,
  HttpVerbs,
} from './http.types';
import { ScenarioUri } from './scenario.interface';

/**
 * Options to instantiate a request
 */
export interface HttpRequestOptions {
  uri: ScenarioUri;
  baseUrl?: string;
  bearerToken?: string;
  headers?: HttpHeaders;
  cookies?: KeyValue<string>;
  queryString?: KeyValue<string>;
  auth?: HttpAuth;
  userAgent?: string;
  proxy?: HttpProxy;
  data?: HttpBody;
  responseType?: HttpResponseType;
  responseEncoding?: HttpEncoding;
  timeout?: number;
  maxRedirects?: number;
}

export interface RequestInterface {
  pathReplace(variables: [string, any][]): void;
  uri: ScenarioUri;
  url: URL;
  baseUrl: string | undefined;
  method: HttpVerbs;
  path: string;
  headers: HttpHeaders;
  cookies: KeyValue;
  bearerToken: string | undefined;
  auth: HttpAuth | undefined;
  proxy: HttpProxy | undefined;
  data: HttpBody | undefined;
  responseType: HttpResponseType;
  responseEncoding: HttpEncoding;
  queryString: KeyValue<string>;
  timeout: number;
  maxRedirects: number;
}
