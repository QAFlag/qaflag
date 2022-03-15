import { HttpVerbs } from '../types/http-methods';
import { RequestInterface } from '../types/request.interface';
import { ScenarioOpts } from '../types/scenario.types';

export function RequestType() {
  abstract class RequestAbstract implements RequestInterface {
    public readonly method: HttpVerbs;
    public readonly path: string;

    constructor(public readonly opts: ScenarioOpts) {
      const uri = opts.uri.split(' ');
      this.method = uri[0].toLowerCase() as HttpVerbs;
      this.path = uri[1];
    }
  }
  return RequestAbstract;
}
