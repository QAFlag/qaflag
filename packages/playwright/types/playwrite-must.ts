import { TestResult } from '@qaflag/core';
import { PlaywrightValue } from '../models/playwright.value';

type PlaywrightAssertionOutput = Promise<TestResult<PlaywrightValue>>;

export interface PlaywrightMust extends PlaywrightMustNot {
  all: PlaywrightMust;
  not: PlaywrightMustNot;
}

export interface PlaywrightMustNot extends Assertions_PlaywrightMust {
  be: PlaywrightMustBe;
  have: PlaywrightMustHave;
}

export interface PlaywrightMustHave extends Assertions_PlaywrightMustHave {
  all: PlaywrightMust;
  any: PlaywrightMust;
  none: PlaywrightMust;
  some: PlaywrightMust;
}

export interface PlaywrightMustBe extends Assertions_PlaywrightMustBe {
  in: Assertions_PlaywrightMustBeIn;
}

export interface Assertions_PlaywrightMustBeIn {
  focus(): PlaywrightAssertionOutput;
}

export interface Assertions_PlaywrightMust {
  exist(): PlaywrightAssertionOutput;
  containText(text: string): PlaywrightAssertionOutput;
  lookLike(
    compareTo: Buffer | string,
    allowableDiff?: number,
  ): PlaywrightAssertionOutput;
}

export interface Assertions_PlaywrightMustHave {
  attribute(name: string): PlaywrightAssertionOutput;
  attributeValue(name: string, value: string): PlaywrightAssertionOutput;
  className(name: string): PlaywrightAssertionOutput;
  focus(): PlaywrightAssertionOutput;
  selectedIndex(index: number): PlaywrightAssertionOutput;
  selectedText(text: string): PlaywrightAssertionOutput;
  style(property: string, value: string): PlaywrightAssertionOutput;
  tagName(name: string): PlaywrightAssertionOutput;
  text(text: string): PlaywrightAssertionOutput;
  value(value: string): PlaywrightAssertionOutput;
}

export interface Assertions_PlaywrightMustBe {
  checked(): PlaywrightAssertionOutput;
  disabled(): PlaywrightAssertionOutput;
  editable(): PlaywrightAssertionOutput;
  enabled(): PlaywrightAssertionOutput;
  equal(element: PlaywrightValue): PlaywrightAssertionOutput;
  hidden(): PlaywrightAssertionOutput;
  unchecked(): PlaywrightAssertionOutput;
  visible(): PlaywrightAssertionOutput;
  empty(): PlaywrightAssertionOutput;
}
