export interface StringMust {
  be: StringMustBe;
  match: StringMustMatch;
  not: StringMust;
  equal(value: any): void;
  exactly(value: string): void;
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
  equalTo(value: any): void;
  like(value: any): void;
  numeric(): void;
  uppercase(): void;
  lowercase(): void;
  empty(): void;
  onlyLetters(): void;
  onlyNumbers(): void;
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
