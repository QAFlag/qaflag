import { CaseDefinitions } from '../suite/suite.mixin';

export function Case(opts?: { description?: string }) {
  return function (
    target: any,
    methodName: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    target[CaseDefinitions] = target[CaseDefinitions] || {};
    target[CaseDefinitions][methodName] = {
      name: methodName,
      description: opts?.description,
    };
    return descriptor;
  };
}
