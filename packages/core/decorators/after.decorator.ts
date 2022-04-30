import { AfterAlls } from '../suite/suite.mixin';

export function After() {
  return function (
    target: any,
    methodName: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    target[AfterAlls] = target[AfterAlls] || {};
    target[AfterAlls][methodName] = descriptor.value;
    return descriptor;
  };
}
