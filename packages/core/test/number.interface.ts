import { TestResult } from './result';

export interface NumberMust {
  be: NumberMustBe;
  not: NumberMust;
  equal(value: number): TestResult<typeof this>;
  roundTo(value: number): TestResult<typeof this>;
  roundDownTo(value: number): TestResult<typeof this>;
  roundUpTo(value: number): TestResult<typeof this>;
}

export interface NumberMustBe extends NumberMustBeAn {
  a: NumberMustBeAn;
  an: NumberMustBeAn;
  equalTo(value: number): TestResult<typeof this>;
  greaterThan(value: number): TestResult<typeof this>;
  greaterThanOrEquals(value: number): TestResult<typeof this>;
  lessThan(value: number): TestResult<typeof this>;
  lessThanOrEquals(value: number): TestResult<typeof this>;
  divisibleBy(value: number): TestResult<typeof this>;
  between(valueA: number, valueB: number): TestResult<typeof this>;
  closeTo(value: number, within?: number): TestResult<typeof this>;
  zero(): TestResult<typeof this>;
}

interface NumberMustBeAn {
  integer(): TestResult<typeof this>;
  positiveNumber(): TestResult<typeof this>;
  negativeNumber(): TestResult<typeof this>;
  positiveInteger(): TestResult<typeof this>;
  negativeInteger(): TestResult<typeof this>;
  evenInteger(): TestResult<typeof this>;
  oddInteger(): TestResult<typeof this>;
  nonZeroNumber(): TestResult<typeof this>;
  nonZeroInteger(): TestResult<typeof this>;
  nan(): TestResult<typeof this>;
}
