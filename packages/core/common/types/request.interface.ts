import { Agent } from 'http';
import { ScenarioTemplate } from '../decorators/scenario.decorator';
import { HttpHeaders, KeyValue } from './general.types';
import { HttpAuth, HttpVerbs } from './http.types';
import { ScenarioUri } from './scenario.interface';

export interface RequestInterface {
  pathReplace(variables: [string, any][]): void;
  opts: ScenarioTemplate;
  method: HttpVerbs;
  uri: ScenarioUri;
  path: string;
  headers: HttpHeaders;
  cookies: KeyValue;
  auth?: HttpAuth;
  userAgent: string;
  proxy?: Agent;
}
