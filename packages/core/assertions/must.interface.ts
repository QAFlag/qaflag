import { ValueInterface } from '../value/value.interface';
import { NumberMust } from './number.interface';
import { TestResult } from './result';

export interface Must<T extends ValueInterface> extends MustNot<T> {
  not: Must<T>;
}

export interface MustNot<T extends ValueInterface> extends Assertions_Must<T> {
  all: MustAll<T>;
  be: MustBe<T>;
  have: MustHave<T>;
  match: Assertions_MustMatch<T>;
}

export interface MustHave<T extends ValueInterface>
  extends Assertions_MustHave<T> {
  a: MustHaveA<T>;
  all: MustHaveAll<T>;
  any: MustHaveAny<T>;
  length: NumberMust;
  none: MustHaveNone<T>;
  some: MustHaveSome<T>;
}

export interface MustHaveA<T extends ValueInterface> {
  length: NumberMust;
}

export interface MustBe<T extends ValueInterface> extends Assertions_MustBe<T> {
  a: Assertions_MustBeAn<T>;
  an: Assertions_MustBeAn<T>;
}

export interface MustAll<T extends ValueInterface>
  extends Assertions_MustAll<T> {
  be: MustBe<T>;
  have: MustHave<T>;
  match: Assertions_MustMatch<T>;
  not: MustNot<T>;
}

export interface MustHaveAll<T extends ValueInterface>
  extends Assertions_MustHaveAll<T> {
  be: MustBe<T>;
  not: MustNot<T>;
}

export interface MustHaveSome<T extends ValueInterface>
  extends Assertions_MustHaveAll<T> {
  be: MustBe<T>;
}

export interface MustHaveAny<T extends ValueInterface>
  extends Assertions_Must<T> {
  be: MustBe<T>;
}

export interface MustHaveNone<T extends ValueInterface>
  extends Assertions_MustHaveAll<T> {
  be: MustBe<T>;
}

export interface Assertions_Must<T extends ValueInterface> {
  contain(value: any | any[] | ValueInterface): TestResult<T>;
  endWith(value: string | string[]): TestResult<T>;
  equal(value: any): TestResult<T>;
  exist(): TestResult<T>;
  include(value: any): TestResult<T>;
  roundDownTo(value: number): TestResult<T>;
  roundTo(value: number): TestResult<T>;
  roundUpTo(value: number): TestResult<T>;
  startWith(value: string | string[]): TestResult<T>;
}

export interface Assertions_MustMatch<T extends ValueInterface> {
  regularExpression(value: RegExp): TestResult<T>;
}

export interface Assertions_MustHave<T extends ValueInterface> {
  atLeast(n: number): MustHaveSome<T>;
  atMost(n: number): MustHaveSome<T>;
  only(n: number): MustHaveSome<T>;
  properties(propertyNames: string[]): TestResult<T>;
  property(propertyName: string): TestResult<T>;
}

export interface Assertions_MustBe<T extends ValueInterface>
  extends Assertions_MustBeAn<T> {
  after(date: string | Date): TestResult<T>;
  alphanumeric(): TestResult<T>;
  before(date: string | Date): TestResult<T>;
  between(valueA: number, valueB: number): TestResult<T>;
  closeTo(value: number, within?: number): TestResult<T>;
  containedIn(value: string | any[] | ValueInterface): TestResult<T>;
  divisibleBy(value: number): TestResult<T>;
  empty(): TestResult<T>;
  equalTo(value: any): TestResult<T>;
  exactly(value: any): TestResult<T>;
  false(): TestResult<T>;
  greaterThan(value: number): TestResult<T>;
  greaterThanOrEquals(value: number): TestResult<T>;
  inArray(value: any[]): TestResult<T>;
  inTheFuture(): TestResult<T>;
  inThePast(): TestResult<T>;
  lessThan(value: number): TestResult<T>;
  lessThanOrEquals(value: number): TestResult<T>;
  like(value: any): TestResult<T>;
  null(): TestResult<T>;
  numeric(): TestResult<T>;
  onlyLetters(): TestResult<T>;
  onlyNumbers(): TestResult<T>;
  true(): TestResult<T>;
  truthy(): TestResult<T>;
  undefined(): TestResult<T>;
  zero(): TestResult<T>;
}

export interface Assertions_MustBeAn<T extends ValueInterface> {
  array(): TestResult<T>;
  arrayOf(typeName: 'string' | 'number' | 'boolean' | 'object'): TestResult<T>;
  creditCard(): TestResult<T>;
  date(): TestResult<T>;
  email(): TestResult<T>;
  emptyArray(): TestResult<T>;
  emptyObject(): TestResult<T>;
  emptyString(): TestResult<T>;
  even(): TestResult<T>;
  integer(): TestResult<T>;
  ipAddress(version?: number): TestResult<T>;
  jwt(): TestResult<T>;
  lowercase(): TestResult<T>;
  md5(): TestResult<T>;
  mimeType(): TestResult<T>;
  nan(): TestResult<T>;
  negativeInteger(): TestResult<T>;
  negativeNumber(): TestResult<T>;
  nonZeroInteger(): TestResult<T>;
  nonZeroNumber(): TestResult<T>;
  null(): TestResult<T>;
  number(): TestResult<T>;
  numericString(): TestResult<T>;
  object(): TestResult<T>;
  odd(): TestResult<T>;
  positiveInteger(): TestResult<T>;
  positiveNumber(): TestResult<T>;
  postalCode(countryCode: string): TestResult<T>;
  slug(): TestResult<T>;
  string(): TestResult<T>;
  type(typeName: string): TestResult<T>;
  undefined(): TestResult<T>;
  uppercase(): TestResult<T>;
  url(): TestResult<T>;
  uuid(version?: number): TestResult<T>;
}

export interface Assertions_MustAll<T extends ValueInterface> {
  contain(value: string | string[]): TestResult<T>;
  endWith(value: string | string[]): TestResult<T>;
  equal(value: any): TestResult<T>;
  exist(): TestResult<T>;
  include(value: any): TestResult<T>;
  startWith(value: string | string[]): TestResult<T>;
}

export interface Assertions_MustHaveAll<T extends ValueInterface> {
  contain(value: string | string[]): TestResult<T>;
  endWith(value: string | string[]): TestResult<T>;
  equal(value: any): TestResult<T>;
  exist(): TestResult<T>;
  include(value: any): TestResult<T>;
  startWith(value: string | string[]): TestResult<T>;
}
