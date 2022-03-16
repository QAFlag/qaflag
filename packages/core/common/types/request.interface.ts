import { HttpVerbs } from './http-methods';
import { ScenarioOpts, ScenarioUri } from './scenario.types';

export interface RequestInterface {
  method: HttpVerbs;
  uri: ScenarioUri;
  path: string;
  opts: ScenarioOpts;
  pathReplace(variables: [string, any][]): void;
}
