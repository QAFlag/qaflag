import { ClassConstructor } from './general.types';
import { HttpRequestOptions } from './http-request.interface';
import { PersonaInterface } from './persona.interface';
import { ScenarioInterface } from './scenario.interface';
import { SuiteInterface } from './suite.interface';

export interface ScenarioDecoratorOpts extends HttpRequestOptions {
  description?: string;
  type?: ScenarioConstructor;
  step?: number;
  persona?: PersonaInterface;
  statusCode?: number;
  schema?:
    | string
    | ClassConstructor<unknown>
    | {
        name: string | ClassConstructor<unknown>;
        type?: string;
      };
}

export type ScenarioInitOpts = ScenarioDecoratorOpts & {
  key: string | Symbol;
  step: number;
  next: (...args: any[]) => Promise<void>;
};

export interface ScenarioConstructor<
  ScenarioType extends ScenarioInterface = ScenarioInterface,
> {
  new (opts: ScenarioInitOpts, suite: SuiteInterface): ScenarioType;
}
