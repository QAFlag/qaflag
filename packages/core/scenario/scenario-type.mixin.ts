import { ScenarioInitOpts } from './scenario.options';
import { Logger } from '../models/logger';
import { HttpVerbs } from '../types/http.types';
import { ContextInterface } from '../context/context.interface';
import {
  ScenarioInterface,
  ScenarioResult,
  ScenarioStatus,
} from './scenario.interface';
import { SuiteInterface } from '../suite/suite.interface';
import { RequestInterface } from '../types/request-interface';
import { PersonaInterface } from '../persona/persona.interface';

export type ScenarioTypeOpts = {
  name: string;
};

export function ScenarioType(initOpts: ScenarioTypeOpts) {
  abstract class ScenarioAbstract implements ScenarioInterface {
    constructor(
      public readonly opts: ScenarioInitOpts,
      public readonly suite: SuiteInterface,
    ) {
      this.key = opts.key;
      this.description = opts.description || '';
      this.step = opts.step || 1;
      this.__next = opts.next;
    }

    public abstract context: ContextInterface | null;
    public abstract request: RequestInterface;
    public abstract __execute(): Promise<void>;

    public type: string = initOpts.name;
    public key: string | Symbol;
    public description: string;
    public step: number;
    public __next: (...args: any[]) => Promise<void>;
    public readonly logger = new Logger();

    public async __startUp(): Promise<void> {
      await this.persona.__startUp(this.suite);
      this.request.persona = this.persona;
      this.request.pathArgs = this.suite.store.entries();
      this.logger.start();
    }

    public async __tearDown(): Promise<void> {
      this.logger.end();
    }

    public get title() {
      return String(this.key);
    }

    public get uri() {
      return this.request.uri;
    }

    public get method(): HttpVerbs {
      return this.request.method;
    }

    public get path(): string {
      return this.request.path;
    }

    public get status(): ScenarioStatus {
      if (!this.logger.started) return 'not started';
      if (!this.logger.ended) return 'in progress';
      return this.logger.failed ? 'fail' : 'pass';
    }

    public get result(): ScenarioResult {
      return {
        status: this.status,
        failCount: this.logger.filter('fail').length,
        passCount: this.logger.filter('pass').length,
        optionalFailCount: this.logger.filter('optionalFail').length,
      };
    }

    public get persona(): PersonaInterface {
      return this.opts.persona || this.suite.persona;
    }

    public get statusCode(): number | null {
      return this.opts.statusCode || null;
    }
  }
  return ScenarioAbstract;
}
