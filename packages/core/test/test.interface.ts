import { ValueInterface } from '../value/value.interface';
import { TestResult } from './result';

export interface TestInterface<T extends ValueInterface> {
  readonly input: T;
  readonly not: TestInterface<T>;
  equal(value: any): TestResult<T>;
}
