import { TestResult } from './result';

export interface DateMust {
  be: DateMustBe;
  not: DateMust;
  equal(value: Date): TestResult<typeof this>;
}

interface DateMustBe {
  inThePast(): TestResult<typeof this>;
  inTheFuture(): TestResult<typeof this>;
  before(otherDate: string | Date): TestResult<typeof this>;
  after(otherDate: string | Date): TestResult<typeof this>;
}
