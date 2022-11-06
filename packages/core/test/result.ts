interface GenericTest {
  reset(): typeof this;
}

export class TestResult<TestType extends GenericTest> {
  constructor(private test: TestType, public readonly passed: boolean) {}

  public get and(): TestType {
    return this.test.reset();
  }
}
