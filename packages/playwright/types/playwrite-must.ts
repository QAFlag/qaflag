type PlaywrightAssertionOutput = Promise<void>;

export interface PlaywrightMust extends PlaywrightMustNot {
  not: PlaywrightMustNot;
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
}

export interface PlaywrightMustBeIn {
  focus(): PlaywrightAssertionOutput;
}

export interface PlaywrightMustBe {
  a: PlaywrightMustBeAn;
  an: PlaywrightMustBeAn;
  in: PlaywrightMustBeIn;
  visible(): PlaywrightAssertionOutput;
  hidden(): PlaywrightAssertionOutput;
  checked(): PlaywrightAssertionOutput;
  enabled(): PlaywrightAssertionOutput;
  disabled(): PlaywrightAssertionOutput;
  editable(): PlaywrightAssertionOutput;
}

export interface PlaywrightMustBeAn {}

export interface PlaywrightMustHaveNone {
  be: PlaywrightMustBe;
}
