export interface NumberMust {
  be: NumberMustBe;
  not: NumberMust;
  equal(value: number): void;
}

export interface NumberMustBe extends NumberMustBeAn {
  a: NumberMustBeAn;
  an: NumberMustBeAn;
  equalTo(value: number): void;
  greaterThan(value: number): void;
  greaterThanOrEquals(value: number): void;
  lessThan(value: number): void;
  lessThanOrEquals(value: number): void;
  divisibleBy(value: number): void;
  between(valueA: number, valueB: number): void;
  zero(): void;
}

interface NumberMustBeAn {
  integer(): void;
  positiveNumber(): void;
  negativeNumber(): void;
  positiveInteger(): void;
  negativeInteger(): void;
  evenInteger(): void;
  oddInteger(): void;
  nonZeroNumber(): void;
  nonZeroInteger(): void;
  nan(): void;
}
