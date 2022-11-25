import { ValueInterface } from '../value/value.interface';
import { TestInterface } from './test.interface';

export class TestResult<T extends ValueInterface> {
  constructor(
    public readonly test: TestInterface<T>,
    public readonly passes: boolean,
    public readonly actualValue?: string | null,
  ) {}

  public get fails(): boolean {
    return !this.passes;
  }

  public get and(): T {
    return this.test.input;
  }
}
