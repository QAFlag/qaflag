import { GenericValue } from '../value/values';
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
  equal(value: any): TestResult<GenericValue>;
  startWith(value: string | string[]): TestResult<GenericValue>;
  endWith(value: string | string[]): TestResult<GenericValue>;
  include(value: any): TestResult<GenericValue>;
  contain(value: string | string[]): TestResult<GenericValue>;
  exist(): TestResult<GenericValue>;
  roundTo(value: number): TestResult<GenericValue>;
  roundUpTo(value: number): TestResult<GenericValue>;
  roundDownTo(value: number): TestResult<GenericValue>;
  zero(): TestResult<GenericValue>;
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
  property(propertyName: string): TestResult<GenericValue>;
  properties(propertyNames: string[]): TestResult<GenericValue>;
}

export interface MustBe extends MustBeAn {
  a: MustBeAn;
  an: MustBeAn;
  equalTo(value: any): TestResult<GenericValue>;
  exactly(value: any): TestResult<GenericValue>;
  like(value: any): TestResult<GenericValue>;
  greaterThan(value: number): TestResult<GenericValue>;
  greaterThanOrEquals(value: number): TestResult<GenericValue>;
  lessThan(value: number): TestResult<GenericValue>;
  lessThanOrEquals(value: number): TestResult<GenericValue>;
  true(): TestResult<GenericValue>;
  false(): TestResult<GenericValue>;
  truthy(): TestResult<GenericValue>;
  falsy(): TestResult<GenericValue>;
  closeTo(value: number, within?: number): TestResult<GenericValue>;
  before(date: string | Date): TestResult<GenericValue>;
  after(date: string | Date): TestResult<GenericValue>;
  inThePast(): TestResult<GenericValue>;
  inTheFuture(): TestResult<GenericValue>;
  alphanumeric(): TestResult<GenericValue>;
  onlyLetters(): TestResult<GenericValue>;
  onlyNumbers(): TestResult<GenericValue>;
  numeric(): TestResult<GenericValue>;
  empty(): TestResult<GenericValue>;
}

export interface MustBeAn {
  type(typeName: string): TestResult<GenericValue>;
  email(): TestResult<GenericValue>;
  creditCard(): TestResult<GenericValue>;
  date(): TestResult<GenericValue>;
  object(): TestResult<GenericValue>;
  array(): TestResult<GenericValue>;
  arrayOf(
    typeName: 'string' | 'number' | 'boolean' | 'object',
  ): TestResult<GenericValue>;
  number(): TestResult<GenericValue>;
  string(): TestResult<GenericValue>;
  nan(): TestResult<GenericValue>;
  integer(): TestResult<GenericValue>;
  positiveNumber(): TestResult<GenericValue>;
  positiveInteger(): TestResult<GenericValue>;
  negativeNumber(): TestResult<GenericValue>;
  negativeInteger(): TestResult<GenericValue>;
  nonZeroNumber(): TestResult<GenericValue>;
  nonZeroInteger(): TestResult<GenericValue>;
  evenInteger(): TestResult<GenericValue>;
  oddInteger(): TestResult<GenericValue>;
  ipAddress(version?: number): TestResult<GenericValue>;
  url(): TestResult<GenericValue>;
  null(): TestResult<GenericValue>;
  undefined(): TestResult<GenericValue>;
  numericString(): TestResult<GenericValue>;
  emptyString(): TestResult<GenericValue>;
  emptyArray(): TestResult<GenericValue>;
  emptyObject(): TestResult<GenericValue>;
  jwt(): TestResult<GenericValue>;
  md5(): TestResult<GenericValue>;
  mimeType(): TestResult<GenericValue>;
  postalCode(countryCode: string): TestResult<GenericValue>;
  uuid(version?: number): TestResult<GenericValue>;
  uppercase(): TestResult<GenericValue>;
  lowercase(): TestResult<GenericValue>;
  slug(): TestResult<GenericValue>;
}

export interface MustAll {
  be: MustBe;
  have: MustHave;
  match: MustMatch;
  not: MustNot;
  equal(value: any): TestResult<GenericValue>;
  startWith(value: string | string[]): TestResult<GenericValue>;
  endWith(value: string | string[]): TestResult<GenericValue>;
  include(value: any): TestResult<GenericValue>;
  contain(value: string | string[]): TestResult<GenericValue>;
  exist(): TestResult<GenericValue>;
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
