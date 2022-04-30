import { BeforeAlls } from '../suite/suite.mixin';

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
