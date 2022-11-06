import { NumberMust } from './number.interface';
import { TestResult } from './result';

export interface Must extends MustNot {
  not: Must;
}

export interface MustNot {
  all: MustAll;
  be: MustBe;
  have: MustHave;
  match: MustMatch;
  equal(value: any): TestResult<typeof this>;
  startWith(value: string | string[]): TestResult<typeof this>;
  endWith(value: string | string[]): TestResult<typeof this>;
  include(value: any): TestResult<typeof this>;
  contain(value: string | string[]): TestResult<typeof this>;
  exist(): TestResult<typeof this>;
  roundTo(value: number): TestResult<typeof this>;
  roundUpTo(value: number): TestResult<typeof this>;
  roundDownTo(value: number): TestResult<typeof this>;
  zero(): TestResult<typeof this>;
}

export interface MustMatch {
  regularExpression(value: RegExp): void;
}

export interface MustHave {
  all: MustHaveAll;
  some: MustHaveSome;
  any: MustHaveAny;
  none: MustHaveNone;
  length: NumberMust;
  only(n: number): MustHaveSome;
  atMost(n: number): MustHaveSome;
  atLeast(n: number): MustHaveSome;
  property(propertyName: string): TestResult<typeof this>;
  properties(propertyNames: string[]): TestResult<typeof this>;
}

export interface MustBe extends MustBeAn {
  a: MustBeAn;
  an: MustBeAn;
  equalTo(value: any): TestResult<typeof this>;
  exactly(value: any): TestResult<typeof this>;
  like(value: any): TestResult<typeof this>;
  greaterThan(value: number): TestResult<typeof this>;
  greaterThanOrEquals(value: number): TestResult<typeof this>;
  lessThan(value: number): TestResult<typeof this>;
  lessThanOrEquals(value: number): TestResult<typeof this>;
  true(): TestResult<typeof this>;
  false(): TestResult<typeof this>;
  truthy(): TestResult<typeof this>;
  falsy(): TestResult<typeof this>;
  closeTo(value: number, within?: number): TestResult<typeof this>;
  before(date: string | Date): TestResult<typeof this>;
  after(date: string | Date): TestResult<typeof this>;
  inThePast(): TestResult<typeof this>;
  inTheFuture(): TestResult<typeof this>;
  alphanumeric(): TestResult<typeof this>;
  onlyLetters(): TestResult<typeof this>;
  onlyNumbers(): TestResult<typeof this>;
  numeric(): TestResult<typeof this>;
  empty(): TestResult<typeof this>;
}

export interface MustBeAn {
  type(typeName: string): TestResult<typeof this>;
  email(): TestResult<typeof this>;
  creditCard(): TestResult<typeof this>;
  date(): TestResult<typeof this>;
  object(): TestResult<typeof this>;
  array(): TestResult<typeof this>;
  arrayOf(
    typeName: 'string' | 'number' | 'boolean' | 'object',
  ): TestResult<typeof this>;
  number(): TestResult<typeof this>;
  string(): TestResult<typeof this>;
  nan(): TestResult<typeof this>;
  integer(): TestResult<typeof this>;
  positiveNumber(): TestResult<typeof this>;
  positiveInteger(): TestResult<typeof this>;
  negativeNumber(): TestResult<typeof this>;
  negativeInteger(): TestResult<typeof this>;
  nonZeroNumber(): TestResult<typeof this>;
  nonZeroInteger(): TestResult<typeof this>;
  evenInteger(): TestResult<typeof this>;
  oddInteger(): TestResult<typeof this>;
  ipAddress(version?: number): TestResult<typeof this>;
  url(): TestResult<typeof this>;
  null(): TestResult<typeof this>;
  undefined(): TestResult<typeof this>;
  numericString(): TestResult<typeof this>;
  emptyString(): TestResult<typeof this>;
  emptyArray(): TestResult<typeof this>;
  emptyObject(): TestResult<typeof this>;
  jwt(): TestResult<typeof this>;
  md5(): TestResult<typeof this>;
  mimeType(): TestResult<typeof this>;
  postalCode(countryCode: string): TestResult<typeof this>;
  uuid(version?: number): TestResult<typeof this>;
  uppercase(): TestResult<typeof this>;
  lowercase(): TestResult<typeof this>;
  slug(): TestResult<typeof this>;
}

export interface MustAll {
  be: MustBe;
  have: MustHave;
  match: MustMatch;
  not: MustNot;
  equal(value: any): TestResult<typeof this>;
  startWith(value: string | string[]): TestResult<typeof this>;
  endWith(value: string | string[]): TestResult<typeof this>;
  include(value: any): TestResult<typeof this>;
  contain(value: string | string[]): TestResult<typeof this>;
  exist(): TestResult<typeof this>;
}

export interface MustHaveAll {
  be: MustBe;
  not: MustNot;
}

export interface MustHaveSome {
  be: MustBe;
}

export interface MustHaveAny {
  be: MustBe;
}

export interface MustHaveNone {
  be: MustBe;
}
