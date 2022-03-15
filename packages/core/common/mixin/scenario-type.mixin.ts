import { Logger } from '../models/logger';
import { HttpVerbs } from '../types/http-methods';
import { MessageType } from '../types/message.interface';
import { ResponseInterface } from '../types/response.interface';
import { ScenarioInterface } from '../types/scenario.interface';
import { ScenarioOpts, ScenarioUri } from '../types/scenario.types';
import { SuiteInterface } from '../types/suite.interface';

export type ScenarioTypeOpts = {
  name: string;
};

export function ScenarioType(initOpts: ScenarioTypeOpts) {
  abstract class ScenarioAbstract implements ScenarioInterface {
    constructor(
      public readonly opts: ScenarioOpts,
      public readonly suite: SuiteInterface,
    ) {
      this.key = opts.key;
      this.description = opts.description;
      this.uri = opts.uri;
      this.step = opts.step || 1;
      this.next = opts.next;
    }

    public abstract response: ResponseInterface | null;
    public abstract execute(): Promise<void>;

    public name: string = initOpts.name;
    public key: string | Symbol;
    public description: string;
    public uri: ScenarioUri;
    public step: number;
    public next: (...args: any[]) => Promise<void>;
    public readonly logger = new Logger();

    public get method(): HttpVerbs {
      return this.uri.split(' ')[0].toLowerCase() as HttpVerbs;
    }

    public get path(): string {
      return this.uri.split(' ')[1];
    }

    public log(type: MessageType, text: string): void {
      this.logger.log(type, text);
    }

    public uriReplace(variables: [string, any][]): void {
      const method = this.method;
      let path = this.path;
      variables.forEach(([key, value]) => {
        path = path.replace(`{${key}}`, String(value));
      });
      this.uri = `${method} ${path}`;
    }
  }
  return ScenarioAbstract;
}
