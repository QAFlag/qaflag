export interface TestInterface {
  optionally: this;
  not: this;
  all: this;
  any: this;
  none: this;
  equalTo(value: any): void;
  greaterThan(value: number): void;
  greaterThanOrEquals(value: number): void;
  lessThan(value: number): void;
  lessThanOrEquals(value: number): void;
  between(valueA: number, valueB: number): void;
  includes(value: any): void;
  startsWith(value: string | string[]): void;
  endsWith(value: string | string[]): void;
  contains(value: string | string[]): void;
  matches(value: RegExp): void;
  email(): void;
  creditCard(): void;
  date(): void;
  integer(): void;
  positive(): void;
  negative(): void;
  ipAddress(version?: number): void;
  null(): void;
  undefined(): void;
  truthy(): void;
}
