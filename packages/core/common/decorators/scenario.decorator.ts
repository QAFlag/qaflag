import { ScenarioDefinitions } from '../mixin/suite.mixin';
import { HttpHeaders, KeyValue } from '../types/general.types';
import { HttpAuth, HttpProxy } from '../types/http.types';
import { ScenarioInterface, ScenarioUri } from '../types/scenario.interface';
import { SuiteInterface } from '../types/suite.interface';

export type ScenarioDecoratorOpts = {
  uri: ScenarioUri;
  description?: string;
  step?: number;
  bearerToken?: string;
  headers?: HttpHeaders;
  cookies?: KeyValue;
  auth?: HttpAuth;
  userAgent?: string;
  proxy?: HttpProxy;
};

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
