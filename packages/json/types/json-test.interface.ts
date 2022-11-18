import {
  MustAll,
  MustBe,
  Assertions_MustBeAn,
  MustHave,
  MustHaveAll,
  MustHaveAny,
  MustHaveNone,
  MustHaveSome,
  Assertions_MustMatch,
  MustNot,
  ValueInterface,
} from '@qaflag/core';
import { ClassConstructor } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';

export interface JsonMust<T extends ValueInterface> extends JsonMustNot<T> {
  not: JsonMustNot<T>;
}

export interface JsonMustNot<T extends ValueInterface> extends MustNot<T> {
  be: JsonMustBe<T>;
  have: JsonMustHave<T>;
  match: JsonMustMatch<T>;
  all: JsonMustAll<T>;
}

export interface JsonMustMatch<T extends ValueInterface>
  extends Assertions_MustMatch<T> {
  dto<Y>(
    className: ClassConstructor<Y>,
    opts?: ValidatorOptions,
  ): Promise<void>;
  jtd(name: string): Promise<void>;
  jsonSchema(name: string): Promise<void>;
}

export interface JsonMustHave<T extends ValueInterface> extends MustHave<T> {
  all: JsonMustHaveAll<T>;
  some: JsonMustHaveSome<T>;
  any: JsonMustHaveAny<T>;
  none: JsonMustHaveNone<T>;
}

export interface JsonMustBe<T extends ValueInterface> extends MustBe<T> {
  a: JsonMustBeAn<T>;
  an: JsonMustBeAn<T>;
}

export interface JsonMustBeAn<T extends ValueInterface>
  extends Assertions_MustBeAn<T> {}

export interface JsonMustAll<T extends ValueInterface> extends MustAll<T> {
  be: JsonMustBe<T>;
  have: JsonMustHave<T>;
  match: JsonMustMatch<T>;
  not: JsonMustNot<T>;
}

export interface JsonMustHaveAll<T extends ValueInterface>
  extends MustHaveAll<T> {
  be: JsonMustBe<T>;
  not: JsonMustNot<T>;
}

export interface JsonMustHaveSome<T extends ValueInterface>
  extends MustHaveSome<T> {
  be: JsonMustBe<T>;
}

export interface JsonMustHaveAny<T extends ValueInterface>
  extends MustHaveAny<T> {
  be: JsonMustBe<T>;
}

export interface JsonMustHaveNone<T extends ValueInterface>
  extends MustHaveNone<T> {
  be: JsonMustBe<T>;
}
