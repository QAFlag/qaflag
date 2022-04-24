export interface Must {
  all: MustAll;
  not: MustNot;
  be: MustBe;
  have: MustHave;
  match: MustMatch;
  equal(value: any): void;
  startWith(value: string | string[]): void;
  endWith(value: string | string[]): void;
  include(value: any): void;
  contain(value: string | string[]): void;
  exist(): void;
}

export interface MustNot {
  be: MustBe;
  have: MustHave;
  match: MustMatch;
  equal(value: any): void;
  startWith(value: string | string[]): void;
  endWith(value: string | string[]): void;
  include(value: any): void;
  contain(value: string | string[]): void;
}

export interface MustMatch {
  regularExpression(value: RegExp): void;
}

export interface MustHave {
  all: MustHaveAll;
  some: MustHaveSome;
  any: MustHaveAny;
  none: MustHaveNone;
  length: MustBeNumber;
  property(propertyName: string): void;
  properties(propertyNames: string[]): void;
}

export interface MustBeNumber {
  equalTo(value: any): void;
  greaterThan(value: number): void;
  greaterThanOrEquals(value: number): void;
  lessThan(value: number): void;
  lessThanOrEquals(value: number): void;
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
