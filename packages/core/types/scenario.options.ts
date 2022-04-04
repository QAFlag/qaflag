import { ClassConstructor } from 'class-transformer';
import { Persona } from '../models/persona';
import { HttpRequestOptions } from './request.interface';
import { ScenarioInterface } from './scenario.interface';
import { SuiteInterface } from './suite.interface';

export interface ScenarioDecoratorOpts extends HttpRequestOptions {
  description?: string;
  step?: number;
  persona?: Persona;
  statusCode?: number;
  schema?:
    | string
    | ClassConstructor<unknown>
    | {
        name: string | ClassConstructor<unknown>;
        type?: string;
      };
}

export type ScenarioTemplate = ScenarioDecoratorOpts & {
  key: string | Symbol;
  step: number;
  next: (...args: any[]) => Promise<void>;
};

export interface ScenarioConstructor<
  ScenarioType extends ScenarioInterface = ScenarioInterface,
> {
  new (opts: ScenarioTemplate, suite: SuiteInterface): ScenarioType;
}
