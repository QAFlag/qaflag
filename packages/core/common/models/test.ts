import { ValueInterface } from '../types/value.interface';

export function test<T>(input: ValueInterface<T>) {
  class Test {
    constructor() {}

    public equals(value: any) {
      if (input.$ == value) {
        input.logger.log('pass', `${input.name} equals ${value}`);
      } else {
        input.logger.log('fail', `${input.name} does not equal ${value}`);
      }
    }

    public greaterThan(value: number) {
      if (Number(input.$) > value) {
        input.logger.log('pass', `${input.name} is greater than ${value}`);
      } else {
        input.logger.log('fail', `${input.name} is not greater equal ${value}`);
      }
    }
  }
  return new Test();
}
