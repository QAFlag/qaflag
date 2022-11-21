import { test, Test } from '../test/test';
import { NumericValue, ValueAbstract, ValueOpts } from './values';

type NumberMap<T> = Record<keyof T, number>;

export class NumberMapValue<T> extends ValueAbstract<NumberMap<T>> {
  constructor(
    public readonly input: Record<keyof T, number>,
    protected opts: ValueOpts,
  ) {
    super(input, opts);
  }

  public get must(): Test<typeof this> {
    return test(this, 'must');
  }

  public get should(): Test<typeof this> {
    return test(this, 'should');
  }

  public get could(): Test<typeof this> {
    return test(this, 'could');
  }

  public find(key: keyof T) {
    return new NumericValue(this.input[key], {
      name: String(key),
      context: this.context,
    });
  }
}
