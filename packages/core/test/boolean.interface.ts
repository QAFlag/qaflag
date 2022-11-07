import { BooleanValue } from '../value/values';
import { TestResult } from './result';

export interface BooleanMust {
  be: BooleanMustBe;
  not: BooleanMust;
  equal(value: boolean): TestResult<BooleanValue>;
}

interface BooleanMustBe {
  true(): TestResult<BooleanValue>;
  false(): TestResult<BooleanValue>;
  equalTo(value: boolean): TestResult<BooleanValue>;
}
