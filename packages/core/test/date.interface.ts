import { DateValue } from '../value/values';
import { TestResult } from './result';

export interface DateMust {
  be: DateMustBe;
  not: DateMust;
  equal(value: Date): TestResult<DateValue>;
}

interface DateMustBe {
  inThePast(): TestResult<DateValue>;
  inTheFuture(): TestResult<DateValue>;
  before(otherDate: string | Date): TestResult<DateValue>;
  after(otherDate: string | Date): TestResult<DateValue>;
}
