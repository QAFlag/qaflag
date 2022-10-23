import { NumberMust } from './number.interface';

export interface Must extends MustNot {
  not: Must;
}

export interface MustNot {
  all: MustAll;
  be: MustBe;
  have: MustHave;
  match: MustMatch;
  equal(value: any): void;
  startWith(value: string | string[]): void;
  endWith(value: string | string[]): void;
  include(value: any): void;
  contain(value: string | string[]): void;
  exist(): void;
  roundTo(value: number): void;
  roundUpTo(value: number): void;
  roundDownTo(value: number): void;
  zero(): void;
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
  property(propertyName: string): void;
  properties(propertyNames: string[]): void;
}

export interface MustBe extends MustBeAn {
  a: MustBeAn;
  an: MustBeAn;
  equalTo(value: any): void;
  exactly(value: any): void;
  like(value: any): void;
  greaterThan(value: number): void;
  greaterThanOrEquals(value: number): void;
  lessThan(value: number): void;
  lessThanOrEquals(value: number): void;
  true(): void;
  false(): void;
  truthy(): void;
  falsy(): void;
  closeTo(value: number, within?: number): void;
  before(date: string | Date): void;
  after(date: string | Date): void;
  inThePast(): void;
  inTheFuture(): void;
  alphanumeric(): void;
  onlyLetters(): void;
  onlyNumbers(): void;
  numeric(): void;
  empty(): void;
}

export interface MustBeAn {
  type(typeName: string): void;
  email(): void;
  creditCard(): void;
  date(): void;
  object(): void;
  array(): void;
  arrayOf(typeName: 'string' | 'number' | 'boolean' | 'object'): void;
  number(): void;
  string(): void;
  nan(): void;
  integer(): void;
  positiveNumber(): void;
  positiveInteger(): void;
  negativeNumber(): void;
  negativeInteger(): void;
  nonZeroNumber(): void;
  nonZeroInteger(): void;
  evenInteger(): void;
  oddInteger(): void;
  ipAddress(version?: number): void;
  url(): void;
  null(): void;
  undefined(): void;
  numericString(): void;
  emptyString(): void;
  emptyArray(): void;
  emptyObject(): void;
  jwt(): void;
  md5(): void;
  mimeType(): void;
  postalCode(countryCode: string): void;
  uuid(version?: number): void;
  uppercase(): void;
  lowercase(): void;
  slug(): void;
}

export interface MustAll {
  be: MustBe;
  have: MustHave;
  match: MustMatch;
  not: MustNot;
  equal(value: any): void;
  startWith(value: string | string[]): void;
  endWith(value: string | string[]): void;
  include(value: any): void;
  contain(value: string | string[]): void;
  exist(): void;
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
