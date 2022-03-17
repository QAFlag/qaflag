import { BeforeAlls, ScenarioDefinitions } from '../mixin/suite.mixin';
import { ScenarioInterface, ScenarioUri } from '../types/scenario.interface';

export function Before() {
  return function (
    target: any,
    methodName: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    target[BeforeAlls] = target[BeforeAlls] || {};
    target[BeforeAlls][methodName] = descriptor.value;
    return descriptor;
  };
}
