import { Cookie } from 'tough-cookie';
import { InputCookies } from '../utils/cookies';
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
import { PersonaInterface } from '../persona/persona.interface';
import { ScenarioUri } from '../scenario/scenario.interface';

/**
 * Options to instantiate a request
 */
export interface HttpRequestOptions {
  auth?: HttpAuth;
  baseUrl?: string;
  bearerToken?: string;
  cookies?: InputCookies;
  data?: HttpBody;
  headers?: HttpHeaders;
  maxRedirects?: number;
  pathArgs?: [string, any][];
  proxy?: HttpProxy;
  queryString?: KeyValue<string>;
  responseEncoding?: HttpEncoding;
  responseType?: HttpResponseType;
  timeout?: number;
  uri?: ScenarioUri;
  userAgent?: string;
}

export interface HttpRequestInterface extends HttpRequestOptions {
  auth: HttpAuth | undefined;
  baseUrl: string | undefined;
  bearerToken: string | undefined;
  cookies: Cookie[];
  data: HttpBody | undefined;
  headers: HttpHeaders;
  maxRedirects: number;
  method: HttpVerbs;
  path: string;
  pathArgs: [string, any][];
  persona: PersonaInterface | undefined;
  proxy: HttpProxy | undefined;
  queryString: KeyValue<string>;
  responseEncoding: HttpEncoding;
  responseType: HttpResponseType;
  timeout: number;
  uri: ScenarioUri;
  url: URL;
  userAgent: string;
}
