export interface StringMust {
  be: StringMustBe;
  match: StringMustMatch;
  not: StringMust;
  equal(value: string): void;
  contain(value: string | string[]): void;
  startWith(value: string | string[]): void;
  endWith(value: string | string[]): void;
}

interface StringMustMatch {
  regularExpression(value: RegExp): void;
}

interface StringMustBe extends StringMustBeAn {
  a: StringMustBeAn;
  an: StringMustBeAn;
  equalTo(value: string): void;
  like(value: string): void;
  numeric(): void;
  uppercase(): void;
  lowercase(): void;
  empty(): void;
  alpha(): void;
  alphanumeric(): void;
}

interface StringMustBeAn {
  creditCard(): void;
  email(): void;
  numericString(): void;
  ipAddress(): void;
  jwt(): void;
  md5(): void;
  uuid(): void;
  slug(): void;
  mimeType(): void;
  mongoId(): void;
}
