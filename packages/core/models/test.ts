import { ValueInterface } from '../types/value.interface';
import validator from 'validator';
import {
  MustBeAn,
  MustBe,
  MustHave,
  Must,
  MustMatch,
} from '../types/test.interface';
import is from '@sindresorhus/is';
import { plainToClass } from 'class-transformer';
import { ClassConstructor } from '../types/general.types';
import { validate, ValidatorOptions } from 'class-validator';

export type assertion = (data: unknown) => boolean;
export type mustOrShould = 'must' | 'should';

export class Test<InputType = unknown>
  implements MustBe, MustHave, Must, MustBeAn, MustMatch
{
  protected message: string[];
  protected isNot: boolean = false;
  protected evalType: 'standard' | 'every' | 'some' = 'standard';

  constructor(
    protected input: ValueInterface<InputType>,
    protected mustOrShould: mustOrShould,
  ) {
    this.message = [input.name, mustOrShould];
  }

  public get not() {
    this.isNot = !this.isNot;
    this.message.push('not');
    return this;
  }

  public get be() {
    this.message.push('be');
    return this;
  }

  public get match() {
    this.message.push('match');
    return this;
  }

  public get a() {
    this.message.push('a');
    return this;
  }

  public get an() {
    this.message.push('an');
    return this;
  }

  public get have() {
    this.message.push('have');
    return this;
  }

  public get all() {
    this.evalType = 'every';
    this.message.push('all');
    return this;
  }

  public get none() {
    this.evalType = 'some';
    this.isNot = true;
    this.message.push('none');
    return this;
  }

  public get any() {
    this.evalType = 'some';
    this.message.push('any');
    return this;
  }

  public get some() {
    this.evalType = 'some';
    this.message.push('some');
    return this;
  }

  private validator(
    methodName: keyof typeof validator,
    thing: string,
    opts?: any,
  ) {
    const method = validator[methodName] as Function;
    this.message.push(thing);
    this.execute(item => method(String(item), opts));
  }

  private is(methodName: keyof typeof is, noun?: string) {
    const method = is[methodName] as Function;
    this.message.push(noun || methodName);
    this.execute(value => method(value));
  }

  private execute(assertion: assertion) {
    const result = (() => {
      if (this.evalType === 'every') {
        return this.input.array.$.every(item => assertion(item));
      }
      if (this.evalType === 'some') {
        return this.input.array.$.some(item => assertion(item));
      }
      return assertion(this.input.$);
    })();
    const pass = this.isNot ? !result : result;
    this.input.logger.log(
      pass ? 'pass' : this.mustOrShould == 'should' ? 'optionalFail' : 'fail',
      this.message.join(' '),
    );
    if (!pass) {
      this.input.logger.log('info', `Actual Value: ${this.input.string.$}`);
    }
  }

  public equal(value: any) {
    this.message.push(`equal ${value}`);
    this.execute(item => item == value);
  }

  public equalTo(value: any) {
    this.message.push(`equal to ${value}`);
    this.execute(item => item == value);
  }

  public exactly(value: any) {
    this.message.push(`exactly ${value}`);
    this.execute(item => item === value);
  }

  public like(value: any) {
    this.message.push(`like ${value}`);
    this.execute(
      item =>
        String(item).toLocaleLowerCase().trim() ===
        value.toLocaleLowerCase().trim(),
    );
  }

  public greaterThan(value: number) {
    this.message.push(`greater than ${value}`);
    this.execute(item => Number(item) > value);
  }

  public greaterThanOrEquals(value: number) {
    this.message.push(`greater than or equal to ${value}`);
    this.execute(item => item >= value);
  }

  public lessThan(value: number) {
    this.message.push(`less than ${value}`);
    this.execute(item => item < value);
  }

  public lessThanOrEquals(value: number) {
    this.message.push(`less than or equal to ${value}`);
    this.execute(item => item <= value);
  }

  public between(valueA: number, valueB: number) {
    this.message.push(`between ${valueA} and ${valueB}`);
    this.execute(item => is.inRange(Number(item), [valueA, valueB]));
  }

  public include(value: any) {
    this.message.push(`include ${value}`);
    this.execute(item => (Array.isArray(item) ? item : [item]).includes(value));
  }

  public startWith(value: string | string[]) {
    this.message.push(`start with ${value}`);
    this.execute(item => {
      const str = String(item);
      return Array.isArray(value)
        ? value.some(x => str.startsWith(x))
        : str.startsWith(value);
    });
  }

  public endWith(value: string | string[]) {
    this.message.push(`end with ${value}`);
    this.execute(item => {
      const str = String(item);
      return Array.isArray(value)
        ? value.some(x => str.endsWith(x))
        : str.endsWith(value);
    });
  }

  public contain(thatValue: string | string[]) {
    this.message.push(`contain ${thatValue}`);
    this.execute(thisValue => {
      if (typeof thisValue == 'string') {
        return Array.isArray(thatValue)
          ? thatValue.some(x => validator.contains(thisValue, x))
          : validator.contains(thisValue, thatValue);
      }
      if (Array.isArray(thisValue)) {
        return Array.isArray(thatValue)
          ? thisValue.some(x => thatValue.includes(x))
          : thisValue.includes(thatValue);
      }
      return false;
    });
  }

  public regularExpression(value: RegExp) {
    this.message.push(`regular expression ${value}`);
    this.execute(item => validator.matches(String(item), value));
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

  public string() {
    this.is('string');
  }

  public object() {
    this.is('object');
  }

  public array() {
    this.is('array');
  }

  public arrayOf(typeName: 'string' | 'number' | 'boolean' | 'object') {
    this.message.push(`array of ${typeName}s`);
    this.execute(value => is.array(value, is[typeName]));
  }

  public number() {
    this.is('number');
  }

  public nonZeroNumber() {
    this.message.push('non-zero number');
    this.execute(value => is.number(value) && value != 0);
  }

  public oddInteger() {
    this.is('oddInteger', 'odd integer');
  }

  public evenInteger() {
    this.is('evenInteger', 'even integer');
  }

  public numericString() {
    this.is('numericString', 'numeric string');
  }

  public ipAddress(version?: number) {
    this.validator('isIP', 'IP Address', version);
  }

  public true() {
    this.message.push('true');
    this.execute(item => item === true);
  }

  public false() {
    this.message.push('false');
    this.execute(item => item === false);
  }

  public positiveNumber() {
    this.message.push('positive number');
    this.execute(item => Number(item) > 0);
  }

  public positiveInteger() {
    this.message.push('positive integer');
    this.execute(value => is.integer(value) && Number(value) > 0);
  }

  public negativeNumber() {
    this.message.push('negative number');
    this.execute(item => Number(item) < 0);
  }

  public negativeInteger() {
    this.message.push('positive integer');
    this.execute(value => is.integer(value) && Number(value) < 0);
  }

  public nullOrUndefined() {
    this.is('nullOrUndefined', 'null or undefined');
  }

  public nan() {
    this.is('nan', 'NaN');
  }

  public null() {
    this.is('null_', 'null');
  }

  public undefined() {
    this.is('undefined');
  }

  public boolean() {
    this.is('boolean');
  }

  public truthy() {
    this.is('truthy');
  }

  public url() {
    this.is('urlString', 'URL');
  }

  public emptyString() {
    this.is('emptyStringOrWhitespace', 'empty string');
  }

  public emptyArray() {
    this.is('emptyArray', 'empty array');
  }

  public emptyObject() {
    this.is('emptyObject', 'empty object');
  }

  public falsy() {
    this.is('falsy');
  }

  public type(typeName: string) {
    this.message.push(typeName);
    this.execute(
      value => is(value).toLocaleLowerCase() == typeName.toLocaleLowerCase(),
    );
  }

  public exist() {
    this.message.push('exist');
    this.execute(value => {
      if (value === null || value === undefined) return false;
      if (typeof value == 'number' && value <= 0) return false;
      if (Array.isArray(value) && value.length == 0) return false;
      return true;
    });
  }

  public async dto<T>(className: ClassConstructor<T>, opts: ValidatorOptions) {
    const instance = plainToClass(className, this.input.$);
    const errors = await validate(instance as unknown as object, opts);
    this.message.push('DTO');
    this.execute(value => errors.length == 0);
    errors.forEach(error => {
      this.input.logger.log('info', error.toString());
    });
  }
}

export function test<T>(input: ValueInterface<T>, type: mustOrShould) {
  return new Test<T>(input, type);
}
