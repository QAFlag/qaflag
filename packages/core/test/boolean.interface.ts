export interface BooleanMust {
  be: BooleanMustBe;
  not: BooleanMust;
  equal(value: boolean): void;
}

interface BooleanMustBe {
  true(): void;
  false(): void;
  equalTo(value: boolean): void;
}
