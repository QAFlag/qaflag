import { DateValue } from '../value/values';
import { TestResult } from './result';

export interface DateMust extends Assertions_DateMust {
  be: Assertions_DateMustBe;
  not: DateMust;
}

export interface Assertions_DateMustBe {
  inThePast(): TestResult<DateValue>;
  inTheFuture(): TestResult<DateValue>;
  before(otherDate: string | Date): TestResult<DateValue>;
  after(otherDate: string | Date): TestResult<DateValue>;
}

export interface Assertions_DateMust {
  equal(value: Date): TestResult<DateValue>;
}
