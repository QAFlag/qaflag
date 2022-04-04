export interface Must {
  all: MustHaveAll;
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

interface MustNot {
  all: MustHaveAll;
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
}

export interface MustBe extends MustBeAn {
  not: MustBe;
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
  number(): void;
  string(): void;
  integer(): void;
  positive(): void;
  negative(): void;
  ipAddress(version?: number): void;
  url(): void;
  null(): void;
  undefined(): void;
  numericString(): void;
  emptyString(): void;
  emptyArray(): void;
  emptyObject(): void;
}

interface MustHaveAll {
  be: MustBe;
}

interface MustHaveSome {
  be: MustBe;
}

interface MustHaveAny {
  be: MustBe;
}

interface MustHaveNone {
  be: MustBe;
}
