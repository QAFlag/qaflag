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
import { PersonaInterface } from './persona.interface';
import { ScenarioUri } from './scenario.interface';

/**
 * Options to instantiate a request
 */
export interface HttpRequestOptions {
  uri: ScenarioUri;
  baseUrl?: string;
  bearerToken?: string;
  headers?: HttpHeaders;
  cookies?: InputCookies;
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

export interface HttpRequestInterface {
  pathReplace(variables: [string, any][]): void;
  uri: ScenarioUri;
  url: URL;
  baseUrl: string | undefined;
  method: HttpVerbs;
  path: string;
  persona: PersonaInterface | undefined;
  headers: HttpHeaders;
  cookies: Cookie[];
  bearerToken: string | undefined;
  auth: HttpAuth | undefined;
  proxy: HttpProxy | undefined;
  data: HttpBody | undefined;
  responseType: HttpResponseType;
  responseEncoding: HttpEncoding;
  queryString: KeyValue<string>;
  timeout: number;
  maxRedirects: number;
  setPersona(persona: PersonaInterface): void;
}
