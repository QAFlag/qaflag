import { TestResult } from './result';

export interface BooleanMust {
  be: BooleanMustBe;
  not: BooleanMust;
  equal(value: boolean): TestResult<typeof this>;
}

interface BooleanMustBe {
  true(): TestResult<typeof this>;
  false(): TestResult<typeof this>;
  equalTo(value: boolean): TestResult<typeof this>;
}
