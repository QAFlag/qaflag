import {
  Must,
  MustAll,
  MustBe,
  MustBeAn,
  MustHave,
  MustHaveAll,
  MustHaveAny,
  MustHaveNone,
  MustHaveSome,
  MustMatch,
  MustNot,
} from '@qaflag/core/types/test.interface';

export interface JsonMust extends Must {
  all: JsonMustAll;
  not: JsonMustNot;
  be: JsonMustBe;
  have: JsonMustHave;
  match: JsonMustMatch;
}

export interface JsonMustNot extends MustNot {
  be: JsonMustBe;
  have: JsonMustHave;
  match: JsonMustMatch;
}

export interface JsonMustMatch extends MustMatch {}

export interface JsonMustHave extends MustHave {
  all: JsonMustHaveAll;
  some: JsonMustHaveSome;
  any: JsonMustHaveAny;
  none: JsonMustHaveNone;
}

export interface JsonMustBe extends MustBe {
  a: JsonMustBeAn;
  an: JsonMustBeAn;
}

export interface JsonMustBeAn extends MustBeAn {}

export interface JsonMustAll extends MustAll {
  be: JsonMustBe;
  have: JsonMustHave;
  match: JsonMustMatch;
  not: JsonMustNot;
}

export interface JsonMustHaveAll extends MustHaveAll {
  be: JsonMustBe;
  not: JsonMustNot;
}

export interface JsonMustHaveSome extends MustHaveSome {
  be: JsonMustBe;
}

export interface JsonMustHaveAny extends MustHaveAny {
  be: JsonMustBe;
}

export interface JsonMustHaveNone extends MustHaveNone {
  be: JsonMustBe;
}
