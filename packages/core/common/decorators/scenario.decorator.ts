import { ScenarioDefinitions } from '../mixin/suite.mixin';
import { Persona } from '../models/persona';
import { HttpRequestOptions } from '../types/request.interface';
import { ScenarioInterface } from '../types/scenario.interface';
import { SuiteInterface } from '../types/suite.interface';

export interface ScenarioDecoratorOpts extends HttpRequestOptions {
  description?: string;
  step?: number;
  persona?: Persona;
  statusCode?: number;
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

export function Scenario(opts: ScenarioDecoratorOpts) {
  return function (
    target: any,
    methodName: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const scenario: ScenarioTemplate = {
      ...opts,
      key: methodName,
      description:
        opts.description !== undefined ? opts.description : String(methodName),
      step: opts.step || 1,
      next: async (scenario: ScenarioInterface) => {
        return originalMethod.apply(scenario.suite, [scenario.response]);
      },
    };
    descriptor.value = () => {
      return scenario;
    };
    target[ScenarioDefinitions] = target[ScenarioDefinitions] || {};
    target[ScenarioDefinitions][methodName] = scenario;
    return descriptor;
  };
}
