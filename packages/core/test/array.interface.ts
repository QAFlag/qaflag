import { NumberMustBe } from './number.interface';
import { Must } from './generic.interface';
import { TestResult } from './result';

export interface ArrayMust {
  be: ArrayMustBe;
  have: ArrayMustHave;
  all: Must;
  none: Must;
  any: Must;
  some: Must;
  not: ArrayMust;
  equal(thatArray: unknown[]): TestResult<typeof this>;
  include(value: any): TestResult<typeof this>;
  contain(value: string | string[]): TestResult<typeof this>;
}

interface ArrayMustBe {
  an: ArrayMustBeAn;
  empty(): TestResult<typeof this>;
  equalTo(thatArray: unknown[]): TestResult<typeof this>;
  arrayOf(
    typeName: 'string' | 'number' | 'boolean' | 'object',
  ): TestResult<typeof this>;
}

interface ArrayMustBeAn {
  arrayOf(
    typeName: 'string' | 'number' | 'boolean' | 'object',
  ): TestResult<typeof this>;
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
  equalTo(value: number): TestResult<typeof this>;
  greaterThan(value: number): TestResult<typeof this>;
  greaterThanOrEquals(value: number): TestResult<typeof this>;
  lessThan(value: number): TestResult<typeof this>;
  lessThanOrEquals(value: number): TestResult<typeof this>;
  divisibleBy(value: number): TestResult<typeof this>;
  between(valueA: number, valueB: number): TestResult<typeof this>;
}
