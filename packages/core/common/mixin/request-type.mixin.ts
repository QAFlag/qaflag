import { ScenarioTemplate } from '../decorators/scenario.decorator';
import { HttpVerbs } from '../types/http.types';
import { RequestInterface } from '../types/request.interface';
import { ScenarioUri } from '../types/scenario.interface';

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

    public get auth() {
      return this.opts.auth;
    }

    public get headers() {
      return {
        ...this.opts.headers,
        'user-agent': this.userAgent,
      };
    }

    public get userAgent() {
      const ua =
        this.opts.userAgent || this.opts.headers['user-agent'] || 'Flagpole';
      return Array.isArray(ua) ? ua.join(' ') : ua;
    }

    public get cookies() {
      return this.opts.cookies || {};
    }

    constructor(public readonly opts: ScenarioTemplate) {
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
