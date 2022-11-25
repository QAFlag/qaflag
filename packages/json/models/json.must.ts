import {
  Assertions_MustMatch,
  ClassConstructor,
  Must,
  MustAll,
  TestResult,
} from '@qaflag/core';
import { ValidatorOptions } from 'class-validator';
import { JsonValue } from './json.value';

export interface JsonMust extends Must<JsonValue> {
  match: JsonMustMatch;
  all: JsonMustAll;
}

interface JsonMustAll extends MustAll<JsonValue> {
  match: JsonMustMatch;
}

interface JsonMustMatch extends Assertions_MustMatch<JsonValue> {
  dto<T>(
    className: ClassConstructor<T>,
    opts?: ValidatorOptions,
  ): Promise<TestResult<JsonValue>>;
  jtd(name: string): Promise<TestResult<JsonValue>>;
  jsonSchema(name: string): Promise<TestResult<JsonValue>>;
}
