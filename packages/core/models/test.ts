import { ValueInterface } from '../types/value.interface';
import validator from 'validator';
import { TestInterface } from '../types/test.interface';

class Test<InputType = unknown> implements TestInterface {
  #isOptional: boolean = false;
  #isNot: boolean = false;
  #evalType: 'standard' | 'every' | 'some' = 'standard';

  private assert: (data: unknown) => boolean = data => false;

  constructor(
    private input: ValueInterface<InputType>,
    private message?: string,
  ) {}

  public get optionally() {
    this.#isOptional = true;
    return this;
  }

  public get not() {
    this.#isNot = true;
    return this;
  }

  public get all() {
    this.#evalType = 'every';
    return this;
  }

  public get none() {
    this.#isNot = true;
    this.#evalType = 'some';
    return this;
  }

  public get any() {
    this.#evalType = 'some';
    return this;
  }

  private validator(
    methodName: keyof typeof validator,
    thing: string,
    opts?: any,
  ) {
    const method = validator[methodName] as Function;
    this.assert = item => method(String(item), opts);
    this.execute(`${this.input.name} is ${thing}`);
  }

  private execute(message: string) {
    const text: string[] = [];
    const result = (() => {
      if (this.#evalType === 'every') {
        text.push(this.#isNot ? 'NOT ALL' : 'ALL');
        return this.input.array.$.every(item => this.assert(item));
      }
      if (this.#evalType === 'some') {
        text.push(this.#isNot ? 'NONE' : 'ANY');
        return this.input.array.$.some(item => this.assert(item));
      }
      return this.assert(this.input.$);
    })();
    const pass = this.#isNot ? !result : result;
    this.input.logger.log(
      pass ? 'pass' : this.#isOptional ? 'optionalFail' : 'fail',
      [...text, this.message || message].join(': '),
    );
    if (!pass) {
      this.input.logger.log('info', `Actual Value: ${this.input.string.$}`);
    }
  }

  public equalTo(value: any) {
    this.assert = item => item == value;
    this.execute(`${this.input.name} equals ${value}`);
  }

  public greaterThan(value: number) {
    this.assert = item => Number(item) > value;
    this.execute(`${this.input.name} is greater than ${value}`);
  }

  public greaterThanOrEquals(value: number) {
    this.assert = item => item >= value;
    this.execute(`${this.input.name} is greater than or equal to ${value}`);
  }

  public lessThan(value: number) {
    this.assert = item => item < value;
    this.execute(`${this.input.name} is less than ${value}`);
  }

  public lessThanOrEquals(value: number) {
    this.assert = item => item <= value;
    this.execute(`${this.input.name} is less than or equal to ${value}`);
  }

  public between(valueA: number, valueB: number) {
    this.assert = item => item >= valueA && item <= valueB;
    this.execute(`${this.input.name} is between ${valueA} and ${valueB}`);
  }

  public includes(value: any) {
    this.assert = item => (Array.isArray(item) ? item : [item]).includes(value);
    this.execute(`${this.input.name} includes ${value}`);
  }

  public startsWith(value: string | string[]) {
    this.assert = item => {
      const str = String(item);
      return Array.isArray(value)
        ? value.some(x => str.startsWith(x))
        : str.startsWith(value);
    };
    this.execute(`${this.input.name} starts with ${value}`);
  }

  public endsWith(value: string | string[]) {
    this.assert = item => {
      const str = String(item);
      return Array.isArray(value)
        ? value.some(x => str.endsWith(x))
        : str.endsWith(value);
    };
    this.execute(`${this.input.name} starts with ${value}`);
  }

  public contains(value: string | string[]) {
    this.assert = item => {
      const str = String(item);
      return Array.isArray(value)
        ? value.some(x => validator.contains(str, x))
        : validator.contains(str, value);
    };
    this.execute(`${this.input.name} includes ${value}`);
  }

  public matches(value: RegExp) {
    this.assert = item => validator.matches(String(item), value);
    this.execute(`${this.input.name} matches ${value}`);
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

  public positive() {
    this.assert = item => Number(item) > 0;
    this.execute(`${this.input.name} is positive.`);
  }

  public negative() {
    this.assert = item => Number(item) < 0;
    this.execute(`${this.input.name} is negative.`);
  }

  public null() {
    this.assert = item => item === null;
    this.execute(`${this.input.name} is null.`);
  }

  public undefined() {
    this.assert = item => item === this.undefined;
    this.execute(`${this.input.name} is undefined.`);
  }

  public truthy() {
    this.assert = item => !!item;
    this.execute(`${this.input.name} is null.`);
  }
}

export function test<T>(input: ValueInterface<T>, assertionText?: string) {
  return new Test<T>(input, assertionText);
}
