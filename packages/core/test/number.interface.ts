import { NumericValue } from '../value/values';
import { TestResult } from './result';

export interface NumberMust extends Assertions_NumberMust {
  be: NumberMustBe;
  not: NumberMust;
}

export interface NumberMustBe extends Assertions_NumberMustBe {
  a: Assertions_NumberMustBeAn;
  an: Assertions_NumberMustBeAn;
}

export interface Assertions_NumberMust {
  equal(value: number): TestResult<NumericValue>;
  roundTo(value: number): TestResult<NumericValue>;
  roundDownTo(value: number): TestResult<NumericValue>;
  roundUpTo(value: number): TestResult<NumericValue>;
}

export interface Assertions_NumberMustBe extends Assertions_NumberMustBeAn {
  exactly(value: string): TestResult<NumericValue>;
  numeric(): TestResult<NumericValue>;
  equalTo(value: number): TestResult<NumericValue>;
  greaterThan(value: number): TestResult<NumericValue>;
  greaterThanOrEquals(value: number): TestResult<NumericValue>;
  lessThan(value: number): TestResult<NumericValue>;
  lessThanOrEquals(value: number): TestResult<NumericValue>;
  divisibleBy(value: number): TestResult<NumericValue>;
  between(valueA: number, valueB: number): TestResult<NumericValue>;
  closeTo(value: number, within?: number): TestResult<NumericValue>;
  zero(): TestResult<NumericValue>;
  undefined(): TestResult<NumericValue>;
  null(): TestResult<NumericValue>;
}

export interface Assertions_NumberMustBeAn {
  number(): TestResult<NumericValue>;
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
