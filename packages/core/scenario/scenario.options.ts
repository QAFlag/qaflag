import { ClassConstructor } from '../types/general.types';
import { HttpRequestOptions } from '../types/http-request.interface';
import { PersonaInterface } from '../persona/persona.interface';
import { ScenarioInterface } from './scenario.interface';
import { SuiteInterface } from '../suite/suite.interface';

export interface ScenarioDecoratorOpts extends HttpRequestOptions {
  description?: string;
  type?: ScenarioConstructor;
  step?: number;
  persona?: PersonaInterface;
  statusCode?: number;
  timeout?: number;
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
