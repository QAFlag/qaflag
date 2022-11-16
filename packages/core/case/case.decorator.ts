import { CaseDefinitions } from '../suite/suite.mixin';
import { titleize } from '../utils/string';
import { TestCase } from './case';

export interface CaseDecoratorOpts {
  description?: string;
}

export function Case(opts?: CaseDecoratorOpts) {
  return function (
    target: any,
    methodName: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    target[CaseDefinitions] = target[CaseDefinitions] || {};
    target[CaseDefinitions][methodName] = new TestCase({
      key: String(methodName),
      title: titleize(String(methodName)),
      description: opts?.description,
    });
    return descriptor;
  };
}
