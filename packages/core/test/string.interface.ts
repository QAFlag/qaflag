import { StringValue } from '../value/values';
import { TestResult } from './result';

export interface StringMust {
  be: StringMustBe;
  match: StringMustMatch;
  not: StringMust;
  equal(value: any): TestResult<StringValue>;
  exactly(value: string | StringValue): TestResult<StringValue>;
  contain(value: string | string[] | StringValue): TestResult<StringValue>;
  startWith(value: string | string[] | StringValue): TestResult<StringValue>;
  endWith(value: string | string[] | StringValue): TestResult<StringValue>;
}

interface StringMustMatch {
  regularExpression(value: RegExp): TestResult<StringValue>;
}

interface StringMustBe extends StringMustBeAn {
  a: StringMustBeAn;
  an: StringMustBeAn;
  equalTo(value: any): TestResult<StringValue>;
  like(value: any): TestResult<StringValue>;
  numeric(): TestResult<StringValue>;
  uppercase(): TestResult<StringValue>;
  lowercase(): TestResult<StringValue>;
  empty(): TestResult<StringValue>;
  onlyLetters(): TestResult<StringValue>;
  onlyNumbers(): TestResult<StringValue>;
  alphanumeric(): TestResult<StringValue>;
  containedIn(value: string | string[] | StringValue): TestResult<StringValue>;
}

interface StringMustBeAn {
  creditCard(): TestResult<StringValue>;
  email(): TestResult<StringValue>;
  numericString(): TestResult<StringValue>;
  ipAddress(): TestResult<StringValue>;
  jwt(): TestResult<StringValue>;
  md5(): TestResult<StringValue>;
  uuid(): TestResult<StringValue>;
  slug(): TestResult<StringValue>;
  mimeType(): TestResult<StringValue>;
  mongoId(): TestResult<StringValue>;
}
