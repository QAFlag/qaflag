import { ValueInterface } from '../types/value.interface';
import validator from 'validator';

export function test<T>(input: ValueInterface<T>, assertionText?: string) {
  class Test {
    constructor() {}

    private validator(
      methodName: keyof typeof validator,
      thing: string,
      opts?: any,
    ) {
      const method = validator[methodName] as Function;
      this.eval(method(input.string.$, opts), `${input.name} is ${thing}`);
    }

    private eval(result: boolean, message: string) {
      input.logger.log(result ? 'pass' : 'fail', assertionText || message);
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

    public includes(value: any) {
      this.eval(
        input.array.$.includes(value),
        `${input.name} includes ${value}`,
      );
    }

    public contains(value: any) {
      this.eval(
        validator.contains(input.string.$, value),
        `${input.name} includes ${value}`,
      );
    }

    public email() {
      this.validator('isEmail', 'email address');
    }

    public creditCard() {
      this.validator('isCreditCard', 'credit card');
    }

    public date() {
      this.validator('isDate', 'date');
    }

    public integer() {
      this.validator('isInt', 'integer');
    }

    public ipAddress(version?: number) {
      this.validator('isIP', 'IP Address', version);
    }
  }
  return new Test();
}
