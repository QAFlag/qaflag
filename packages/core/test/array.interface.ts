import { NumberMust } from './number.interface';
import { Must } from './must.interface';
import { TestResult } from './result';
import { ArrayValue } from '../value/values';
import { ValueInterface } from '../value/value.interface';

export interface ArrayMust<T extends ValueInterface>
  extends Assertions_ArrayMust {
  be: ArrayMustBe;
  have: Assertions_ArrayMustHave<T>;
  all: Must<T>;
  none: Must<T>;
  any: Must<T>;
  some: Must<T>;
  not: ArrayMust<T>;
}

interface ArrayMustBe extends Assertions_ArrayMustBe {
  an: Assertions_ArrayMustBeAn;
}

export interface Assertions_ArrayMustBeAn {
  arrayOf(
    typeName: 'string' | 'number' | 'boolean' | 'object',
  ): TestResult<ArrayValue>;
}

export interface Assertions_ArrayMustHave<T extends ValueInterface> {
  length: NumberMust;
  some: Must<T>;
  any: Must<T>;
  none: Must<T>;
  all: Must<T>;
}

export interface Assertions_ArrayMust {
  equal(thatArray: unknown[]): TestResult<ArrayValue>;
  include(value: any): TestResult<ArrayValue>;
  contain(value: string | string[]): TestResult<ArrayValue>;
}

export interface Assertions_ArrayMustBe {
  empty(): TestResult<ArrayValue>;
  equalTo(thatArray: unknown[]): TestResult<ArrayValue>;
  arrayOf(
    typeName: 'string' | 'number' | 'boolean' | 'object',
  ): TestResult<ArrayValue>;
}
