import { HttpVerbs } from '../types/http.types';
import { ScenarioUri } from '../scenario/scenario.interface';

export const parseUri = (value: ScenarioUri) => {
  const uri = value.split(' ');
  return {
    method: uri[0].toLowerCase() as HttpVerbs,
    path: uri.slice(1).join(' '),
  };
};
