import { TestResult } from './result';

export interface StringMust {
  be: StringMustBe;
  match: StringMustMatch;
  not: StringMust;
  equal(value: any): TestResult<typeof this>;
  exactly(value: string): TestResult<typeof this>;
  contain(value: string | string[]): TestResult<typeof this>;
  startWith(value: string | string[]): TestResult<typeof this>;
  endWith(value: string | string[]): TestResult<typeof this>;
}

interface StringMustMatch {
  regularExpression(value: RegExp): TestResult<typeof this>;
}

interface StringMustBe extends StringMustBeAn {
  a: StringMustBeAn;
  an: StringMustBeAn;
  equalTo(value: any): TestResult<typeof this>;
  like(value: any): TestResult<typeof this>;
  numeric(): TestResult<typeof this>;
  uppercase(): TestResult<typeof this>;
  lowercase(): TestResult<typeof this>;
  empty(): TestResult<typeof this>;
  onlyLetters(): TestResult<typeof this>;
  onlyNumbers(): TestResult<typeof this>;
  alphanumeric(): TestResult<typeof this>;
}

interface StringMustBeAn {
  creditCard(): TestResult<typeof this>;
  email(): TestResult<typeof this>;
  numericString(): TestResult<typeof this>;
  ipAddress(): TestResult<typeof this>;
  jwt(): TestResult<typeof this>;
  md5(): TestResult<typeof this>;
  uuid(): TestResult<typeof this>;
  slug(): TestResult<typeof this>;
  mimeType(): TestResult<typeof this>;
  mongoId(): TestResult<typeof this>;
}
