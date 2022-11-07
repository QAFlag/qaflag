import { ValueInterface } from '../value/value.interface';
import { Test } from './test';

export class TestResult<T extends ValueInterface> {
  constructor(public readonly test: Test<T>, public readonly passes: boolean) {}

  public get fails(): boolean {
    return !this.passes;
  }

  public get and(): T {
    return this.test._value() as T;
  }
}
