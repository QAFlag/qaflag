import { ValueInterface } from '../value/value.interface';

export interface TestInterface<T extends ValueInterface> {
  readonly input: T;
  readonly not: TestInterface<T>;
}
