import { HttpHeaders, KeyValue } from './general.types';
import { HttpAuth, HttpBody, HttpProxy, HttpVerbs } from './http.types';
import { ScenarioUri } from './scenario.interface';

/**
 * Options to instantiate a request
 */
export interface HttpRequestOptions {
  uri: ScenarioUri;
  bearerToken?: string;
  headers?: HttpHeaders;
  cookies?: KeyValue;
  auth?: HttpAuth;
  userAgent?: string;
  proxy?: HttpProxy;
  data?: HttpBody;
}

export interface RequestConstructor {
  new (opts: HttpRequestOptions): RequestInterface;
}

export interface RequestInterface {
  pathReplace(variables: [string, any][]): void;
  uri: ScenarioUri;
  url: URL;
  method: HttpVerbs;
  path: string;
  headers: HttpHeaders;
  cookies: KeyValue;
  bearerToken?: string;
  auth?: HttpAuth;
  proxy: HttpProxy;
  data: HttpBody;
}
