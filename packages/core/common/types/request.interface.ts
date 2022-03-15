import { HttpVerbs } from './http-methods';
import { ScenarioOpts } from './scenario.types';

export interface RequestInterface {
  method: HttpVerbs;
  path: string;
  opts: ScenarioOpts;
}
