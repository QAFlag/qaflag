import { TestResult } from '@qaflag/core';
import { PlaywrightValue } from '../models/playwright.value';

type PlaywrightAssertionOutput = Promise<TestResult<PlaywrightValue>>;

export interface PlaywrightMust extends PlaywrightMustNot {
  not: PlaywrightMustNot;
  all: PlaywrightMust;
}

export interface PlaywrightMustNot {
  be: PlaywrightMustBe;
  have: PlaywrightMustHave;
  exist(): PlaywrightAssertionOutput;
}

export interface PlaywrightMustHave {
  tagName(name: string): PlaywrightAssertionOutput;
  className(name: string): PlaywrightAssertionOutput;
  focus(): PlaywrightAssertionOutput;
  value(value: string): PlaywrightAssertionOutput;
  attribute(name: string, value: string): PlaywrightAssertionOutput;
  all: PlaywrightMust;
  some: PlaywrightMust;
  none: PlaywrightMust;
  any: PlaywrightMust;
}

export interface PlaywrightMustBeIn {
  focus(): PlaywrightAssertionOutput;
}

export interface PlaywrightMustBe {
  in: PlaywrightMustBeIn;
  visible(): PlaywrightAssertionOutput;
  hidden(): PlaywrightAssertionOutput;
  checked(): PlaywrightAssertionOutput;
  enabled(): PlaywrightAssertionOutput;
  disabled(): PlaywrightAssertionOutput;
  editable(): PlaywrightAssertionOutput;
}
