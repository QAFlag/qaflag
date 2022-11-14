import { ScenarioDecoratorOpts, ScenarioInitOpts } from './scenario.options';
import { ScenarioDefinitions } from '../suite/suite.mixin';
import { ScenarioInterface } from './scenario.interface';

export function Scenario(opts?: ScenarioDecoratorOpts) {
  return function (
    target: any,
    methodName: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const scenario: ScenarioInitOpts = {
      ...opts,
      uri: opts?.uri || 'GET /',
      key: methodName,
      description: opts?.description || '',
      step: opts?.step || 1,
      next: async (scenario: ScenarioInterface) => {
        return originalMethod.apply(scenario.suite, [scenario.context]);
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

export function Template(initialOptions: ScenarioDecoratorOpts) {
  return (overrideOptions?: Partial<ScenarioDecoratorOpts>) => {
    const opts = { ...initialOptions, ...overrideOptions };
    return Scenario(opts);
  };
}
