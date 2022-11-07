import { NumericValue } from '../value/values';
import { TestResult } from './result';

export interface NumberMust {
  be: NumberMustBe;
  not: NumberMust;
  equal(value: number): TestResult<NumericValue>;
  roundTo(value: number): TestResult<NumericValue>;
  roundDownTo(value: number): TestResult<NumericValue>;
  roundUpTo(value: number): TestResult<NumericValue>;
}

export interface NumberMustBe extends NumberMustBeAn {
  a: NumberMustBeAn;
  an: NumberMustBeAn;
  equalTo(value: number): TestResult<NumericValue>;
  greaterThan(value: number): TestResult<NumericValue>;
  greaterThanOrEquals(value: number): TestResult<NumericValue>;
  lessThan(value: number): TestResult<NumericValue>;
  lessThanOrEquals(value: number): TestResult<NumericValue>;
  divisibleBy(value: number): TestResult<NumericValue>;
  between(valueA: number, valueB: number): TestResult<NumericValue>;
  closeTo(value: number, within?: number): TestResult<NumericValue>;
  zero(): TestResult<NumericValue>;
}

interface NumberMustBeAn {
  integer(): TestResult<NumericValue>;
  positiveNumber(): TestResult<NumericValue>;
  negativeNumber(): TestResult<NumericValue>;
  positiveInteger(): TestResult<NumericValue>;
  negativeInteger(): TestResult<NumericValue>;
  evenInteger(): TestResult<NumericValue>;
  oddInteger(): TestResult<NumericValue>;
  nonZeroNumber(): TestResult<NumericValue>;
  nonZeroInteger(): TestResult<NumericValue>;
  nan(): TestResult<NumericValue>;
}
