import { ValueInterface } from '../value/value.interface';
import { StringValue } from '../value/values';
import { NumberMust } from './number.interface';
import { TestResult } from './result';

export interface StringMust extends Assertions_StringMust {
  be: StringMustBe;
  match: Assertions_StringMustMatch;
  not: StringMust;
  have: Assertions_StringMustHave;
}

export interface StringMustBe extends Assertions_StringMustBe {
  a: Assertions_StringMustBeAn;
  an: Assertions_StringMustBeAn;
}

export interface StringMustHave {
  length: NumberMust;
}

export interface Assertions_StringMust {
  equal(value: any): TestResult<StringValue>;
  exactly(value: string | StringValue): TestResult<StringValue>;
  contain(value: string | string[] | StringValue): TestResult<StringValue>;
  startWith(value: string | string[] | StringValue): TestResult<StringValue>;
  endWith(value: string | string[] | StringValue): TestResult<StringValue>;
}

export interface Assertions_StringMustHave {
  onlyLetters(): TestResult<StringValue>;
  onlyNumbers(): TestResult<StringValue>;
}

export interface Assertions_StringMustMatch {
  regularExpression(value: RegExp): TestResult<StringValue>;
}

export interface Assertions_StringMustBe extends Assertions_StringMustBeAn {
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
  similarTo(value: string | ValueInterface): TestResult<StringValue>;
}

export interface Assertions_StringMustBeAn {
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
