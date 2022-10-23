import { NumberMustBe } from './number.interface';
import { Must } from './test.interface';

export interface ArrayMust {
  be: ArrayMustBe;
  have: ArrayMustHave;
  all: Must;
  none: Must;
  any: Must;
  some: Must;
  not: ArrayMust;
  equal(thatArray: unknown[]): void;
  include(value: any): void;
  contain(value: string | string[]): void;
}

interface ArrayMustBe {
  an: ArrayMustBeAn;
  empty(): void;
  equalTo(thatArray: unknown[]): void;
  arrayOf(typeName: 'string' | 'number' | 'boolean' | 'object'): void;
}

interface ArrayMustBeAn {
  arrayOf(typeName: 'string' | 'number' | 'boolean' | 'object'): void;
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
  equalTo(value: number): void;
  greaterThan(value: number): void;
  greaterThanOrEquals(value: number): void;
  lessThan(value: number): void;
  lessThanOrEquals(value: number): void;
  divisibleBy(value: number): void;
  between(valueA: number, valueB: number): void;
}
