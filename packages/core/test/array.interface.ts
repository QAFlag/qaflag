import { NumberMustBe } from './number.interface';
import { Must } from './must.interface';
import { TestResult } from './result';
import { ArrayValue, NumericValue } from '../value/values';
import { ValueInterface } from '../value/value.interface';

export interface ArrayMust<T extends ValueInterface> {
  be: ArrayMustBe;
  have: ArrayMustHave<T>;
  all: Must<T>;
  none: Must<T>;
  any: Must<T>;
  some: Must<T>;
  not: ArrayMust<T>;
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

interface ArrayMustHave<T extends ValueInterface> {
  length: ArrayMustHaveLength;
  some: Must<T>;
  any: Must<T>;
  none: Must<T>;
  all: Must<T>;
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
