import { ValueInterface } from '../types/value.interface';
import validator from 'validator';

export function test<T>(input: ValueInterface<T>) {
  class Test {
    constructor() {}

    private validator(methodName: keyof typeof validator, thing: string) {
      const method = validator[methodName] as Function;
      this.eval(method(input.string.$), `${input.name} is ${thing}`);
    }

    private eval(result: boolean, message: string) {
      input.logger.log(result ? 'pass' : 'fail', message);
      if (!result) input.logger.log('info', `Actual Value: ${input.string.$}`);
    }

    public equalTo(value: any) {
      this.eval(input.$ == value, `${input.name} equals ${value}`);
    }

    public greaterThan(value: number) {
      this.eval(
        Number(input.$) > value,
        `${input.name} is greater than ${value}`,
      );
    }

    public greaterThanOrEquals(value: number) {
      this.eval(
        Number(input.$) >= value,
        `${input.name} is greater than or equal to ${value}`,
      );
    }

    public lessThan(value: number) {
      this.eval(Number(input.$) < value, `${input.name} is less than ${value}`);
    }

    public lessThanOrEquals(value: number) {
      this.eval(
        Number(input.$) <= value,
        `${input.name} is less than or equal to ${value}`,
      );
    }

    public between(valueA: number, valueB: number) {
      const thisValue = input.number.$;
      this.eval(
        thisValue >= valueA && thisValue <= valueB,
        `${input.name} is between ${valueA} and ${valueB}`,
      );
    }

    public email() {
      this.validator('isEmail', 'email address');
    }
  }
  return new Test();
}
