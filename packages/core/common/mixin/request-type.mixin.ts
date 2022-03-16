import { HttpVerbs } from '../types/http-methods';
import { RequestInterface } from '../types/request.interface';
import { ScenarioOpts, ScenarioUri } from '../types/scenario.types';

export function RequestType() {
  abstract class RequestAbstract implements RequestInterface {
    #method: HttpVerbs;
    #path: string;

    public get uri(): ScenarioUri {
      return `${this.#method} ${this.#path}`;
    }

    public set uri(value: ScenarioUri) {
      const uri = value.split(' ');
      this.#method = uri[0].toLowerCase() as HttpVerbs;
      this.#path = uri.slice(1).join(' ');
    }

    public get method(): HttpVerbs {
      return this.#method;
    }

    public set method(value: HttpVerbs) {
      this.#method = value;
    }

    public get path(): string {
      return this.#path;
    }

    public set path(value: string) {
      this.#path = value;
    }

    constructor(public readonly opts: ScenarioOpts) {
      this.uri = opts.uri;
    }

    public pathReplace(variables: [string, any][]): void {
      let path = this.path;
      variables.forEach(([key, value]) => {
        path = path.replace(`{${key}}`, String(value));
      });
      this.path = path;
    }
  }
  return RequestAbstract;
}
