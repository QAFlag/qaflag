import { TestBase } from './test-base';

export class TestResult<TestType extends TestBase> {
  constructor(
    public readonly test: TestType,
    public readonly passes: boolean,
  ) {}

  public get fails(): boolean {
    return !this.passes;
  }
}
