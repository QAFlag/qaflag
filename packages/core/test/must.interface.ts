import { ValueInterface } from '../value/value.interface';
import { NumberMust } from './number.interface';
import { TestResult } from './result';

export interface Must<T extends ValueInterface> extends MustNot<T> {
  not: Must<T>;
}

export interface MustNot<T extends ValueInterface> {
  all: MustAll<T>;
  be: MustBe<T>;
  have: MustHave<T>;
  match: MustMatch<T>;
  equal(value: any): TestResult<T>;
  startWith(value: string | string[]): TestResult<T>;
  endWith(value: string | string[]): TestResult<T>;
  include(value: any): TestResult<T>;
  contain(value: string | string[]): TestResult<T>;
  exist(): TestResult<T>;
  roundTo(value: number): TestResult<T>;
  roundUpTo(value: number): TestResult<T>;
  roundDownTo(value: number): TestResult<T>;
  zero(): TestResult<T>;
}

export interface MustMatch<T extends ValueInterface> {
  regularExpression(value: RegExp): void;
}

export interface MustHave<T extends ValueInterface> {
  all: MustHaveAll<T>;
  some: MustHaveSome<T>;
  any: MustHaveAny<T>;
  none: MustHaveNone<T>;
  length: NumberMust;
  only(n: number): MustHaveSome<T>;
  atMost(n: number): MustHaveSome<T>;
  atLeast(n: number): MustHaveSome<T>;
  property(propertyName: string): TestResult<T>;
  properties(propertyNames: string[]): TestResult<T>;
}

export interface MustBe<T extends ValueInterface> extends MustBeAn<T> {
  a: MustBeAn<T>;
  an: MustBeAn<T>;
  equalTo(value: any): TestResult<T>;
  exactly(value: any): TestResult<T>;
  like(value: any): TestResult<T>;
  greaterThan(value: number): TestResult<T>;
  greaterThanOrEquals(value: number): TestResult<T>;
  lessThan(value: number): TestResult<T>;
  lessThanOrEquals(value: number): TestResult<T>;
  true(): TestResult<T>;
  false(): TestResult<T>;
  truthy(): TestResult<T>;
  falsy(): TestResult<T>;
  closeTo(value: number, within?: number): TestResult<T>;
  before(date: string | Date): TestResult<T>;
  after(date: string | Date): TestResult<T>;
  inThePast(): TestResult<T>;
  inTheFuture(): TestResult<T>;
  alphanumeric(): TestResult<T>;
  onlyLetters(): TestResult<T>;
  onlyNumbers(): TestResult<T>;
  numeric(): TestResult<T>;
  empty(): TestResult<T>;
}

export interface MustBeAn<T extends ValueInterface> {
  type(typeName: string): TestResult<T>;
  email(): TestResult<T>;
  creditCard(): TestResult<T>;
  date(): TestResult<T>;
  object(): TestResult<T>;
  array(): TestResult<T>;
  arrayOf(typeName: 'string' | 'number' | 'boolean' | 'object'): TestResult<T>;
  number(): TestResult<T>;
  string(): TestResult<T>;
  nan(): TestResult<T>;
  integer(): TestResult<T>;
  positiveNumber(): TestResult<T>;
  positiveInteger(): TestResult<T>;
  negativeNumber(): TestResult<T>;
  negativeInteger(): TestResult<T>;
  nonZeroNumber(): TestResult<T>;
  nonZeroInteger(): TestResult<T>;
  evenInteger(): TestResult<T>;
  oddInteger(): TestResult<T>;
  ipAddress(version?: number): TestResult<T>;
  url(): TestResult<T>;
  null(): TestResult<T>;
  undefined(): TestResult<T>;
  numericString(): TestResult<T>;
  emptyString(): TestResult<T>;
  emptyArray(): TestResult<T>;
  emptyObject(): TestResult<T>;
  jwt(): TestResult<T>;
  md5(): TestResult<T>;
  mimeType(): TestResult<T>;
  postalCode(countryCode: string): TestResult<T>;
  uuid(version?: number): TestResult<T>;
  uppercase(): TestResult<T>;
  lowercase(): TestResult<T>;
  slug(): TestResult<T>;
}

export interface MustAll<T extends ValueInterface> {
  be: MustBe<T>;
  have: MustHave<T>;
  match: MustMatch<T>;
  not: MustNot<T>;
  equal(value: any): TestResult<T>;
  startWith(value: string | string[]): TestResult<T>;
  endWith(value: string | string[]): TestResult<T>;
  include(value: any): TestResult<T>;
  contain(value: string | string[]): TestResult<T>;
  exist(): TestResult<T>;
}

export interface MustHaveAll<T extends ValueInterface> {
  be: MustBe<T>;
  not: MustNot<T>;
}

export interface MustHaveSome<T extends ValueInterface> {
  be: MustBe<T>;
}

export interface MustHaveAny<T extends ValueInterface> {
  be: MustBe<T>;
}

export interface MustHaveNone<T extends ValueInterface> {
  be: MustBe<T>;
}
