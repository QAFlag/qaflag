import { ScenarioDecoratorOpts, ScenarioOpts } from '../types/scenario.types';
import { ScenarioDefinitions } from '../mixin/suite.mixin';
import { ScenarioInterface } from '../types/scenario.interface';

export function Scenario(opts: ScenarioDecoratorOpts) {
  return function (
    target: any,
    methodName: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const scenario: ScenarioOpts = {
      key: methodName,
      description:
        opts.description !== undefined ? opts.description : String(methodName),
      uri: opts.uri,
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
