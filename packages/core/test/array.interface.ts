import { NumberMustBe } from './number.interface';
import { Must } from './generic.interface';
import { TestResult } from './result';
import { ArrayValue, NumericValue } from '../value/values';

export interface ArrayMust {
  be: ArrayMustBe;
  have: ArrayMustHave;
  all: Must;
  none: Must;
  any: Must;
  some: Must;
  not: ArrayMust;
  equal(thatArray: unknown[]): TestResult<ArrayValue>;
  include(value: any): TestResult<ArrayValue>;
  contain(value: string | string[]): TestResult<ArrayValue>;
}

interface ArrayMustBe {
  an: ArrayMustBeAn;
  empty(): TestResult<ArrayValue>;
  equalTo(thatArray: unknown[]): TestResult<ArrayValue>;
  arrayOf(
    typeName: 'string' | 'number' | 'boolean' | 'object',
  ): TestResult<ArrayValue>;
}

interface ArrayMustBeAn {
  arrayOf(
    typeName: 'string' | 'number' | 'boolean' | 'object',
  ): TestResult<ArrayValue>;
}

interface ArrayMustHave {
  length: ArrayMustHaveLength;
  some: Must;
  any: Must;
  none: Must;
  all: Must;
}

interface ArrayMustHaveLength {
  be: NumberMustBe;
  equalTo(value: number): TestResult<NumericValue>;
  greaterThan(value: number): TestResult<NumericValue>;
  greaterThanOrEquals(value: number): TestResult<NumericValue>;
  lessThan(value: number): TestResult<NumericValue>;
  lessThanOrEquals(value: number): TestResult<NumericValue>;
  divisibleBy(value: number): TestResult<NumericValue>;
  between(valueA: number, valueB: number): TestResult<NumericValue>;
}
