import { BooleanValue } from '../value/values';
import { TestResult } from './result';

export interface BooleanMust extends Assertions_BooleanMust {
  be: Assertions_BooleanMustBe;
  not: BooleanMust;
}

export interface Assertions_BooleanMustBe {
  true(): TestResult<BooleanValue>;
  false(): TestResult<BooleanValue>;
  equalTo(value: boolean): TestResult<BooleanValue>;
}

export interface Assertions_BooleanMust {
  equal(value: boolean): TestResult<BooleanValue>;
}
