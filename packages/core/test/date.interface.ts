export interface DateMust {
  be: DateMustBe;
  not: DateMust;
  equal(value: Date): void;
}

interface DateMustBe {
  inThePast(): void;
  inTheFuture(): void;
  before(otherDate: string | Date): void;
  after(otherDate: string | Date): void;
}
