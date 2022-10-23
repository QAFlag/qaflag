import { ValueInterface } from '../value/value.interface';
import validator from 'validator';
import is from '@sindresorhus/is';
import { humanReadableList } from '../utils/helpers';
import { ArrayValue, NumericValue } from '../value/values';
import { TestBase } from './test-base';
import { Must } from './generic.interface';

export type assertion = (data: unknown) => boolean;
export type mustOrShould = 'must' | 'should';

export class Test<ValueWrapper extends ValueInterface = ValueInterface>
  extends TestBase
  implements Must
{
  constructor(
    input: ValueWrapper,
    mustOrShould: mustOrShould,
    isNot: boolean = false,
    evalType: 'standard' | 'every' | 'some' = 'standard',
    message?: string[],
  ) {
    super(input, mustOrShould, isNot, evalType, message);
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

  protected is(methodName: keyof typeof is, noun?: string) {
    const method = is[methodName] as Function;
    this.message.push(noun || methodName);
    this.execute(value => method(value));
  }

  protected execute(assertion: assertion) {
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
    const text = this.message.join(' ');
    this.input.logger.log(
      pass ? 'pass' : this.mustOrShould == 'should' ? 'optionalFail' : 'fail',
      { text },
    );
    if (!pass) {
      this.input.logger.log('info', {
        text: `Actual Value: ${this.input.string.$}`,
      });
    }
  }

  private clone(input: ValueInterface, pushWord: string) {
    return new Test(input, this.mustOrShould, this.isNot, this.evalType, [
      ...this.message,
      pushWord,
    ]);
  }

  /**
   * CONVERSIONS
   */

  public get length() {
    const getLength = (item: unknown) =>
      Array.isArray(item) ? item.length : String(item).length;
    const length =
      this.evalType == 'standard'
        ? getLength(this.input.$)
        : this.input.array.$.map(item => getLength(item));
    if (typeof length == 'number') {
      return this.clone(
        new NumericValue(length, {
          name: `Length of ${this.input.name}`,
          logger: this.input.logger,
        }),
        'length',
      );
    }
    return this.clone(
      new ArrayValue(Array.isArray(length) ? length : [length], {
        name: `Lengths of ${this.input.name}`,
        logger: this.input.logger,
      }),
      'length',
    );
  }

  /**
   * GENERIC
   */

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

  public include(value: any) {
    this.message.push(`include ${value}`);
    this.execute(item => (Array.isArray(item) ? item : [item]).includes(value));
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
      // Convert to string
      return Array.isArray(thatValue)
        ? thatValue.some(x => validator.contains(String(thisValue), x))
        : validator.contains(String(thisValue), thatValue);
    });
  }

  public exist() {
    this.message.push('exist');
    this.execute(value => {
      if (value === null || value === undefined) return false;
      if (typeof value == 'number' && value <= 0) return false;
      if (Array.isArray(value) && value.length == 0) return false;
      if (value === false) return false;
      return true;
    });
  }

  public true() {
    this.message.push('true');
    this.execute(item => item === true);
  }

  public false() {
    this.message.push('false');
    this.execute(item => item === false);
  }

  public nullOrUndefined() {
    this.is('nullOrUndefined', 'null or undefined');
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

  public empty() {
    this.is('emptyStringOrWhitespace', 'empty string');
  }

  public type(typeName: string) {
    this.message.push(typeName);
    this.execute(
      value => is(value).toLocaleLowerCase() == typeName.toLocaleLowerCase(),
    );
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

  public number() {
    this.is('number');
  }

  public numeric() {
    this.is('numericString', 'numeric');
  }

  /**
   * STRINGS
   */

  public like(value: any) {
    this.message.push(`like ${value}`);
    this.execute(
      item =>
        String(item).toLocaleLowerCase().trim() ===
        value.toLocaleLowerCase().trim(),
    );
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

  public numericString() {
    this.is('numericString', 'numeric string');
  }

  public ipAddress(version?: number) {
    this.validator('isIP', 'IP Address', version);
  }

  public url() {
    this.is('urlString', 'URL');
  }

  public jwt() {
    this.validator('isJWT', 'JWT');
  }

  public md5() {
    this.validator('isMD5', 'MD5 Hash');
  }

  public postalCode(countryCode: string) {
    this.validator(
      'isPostalCode',
      `Postal Code in ${countryCode}`,
      countryCode,
    );
  }

  public uuid(version?: number) {
    this.validator('isUUID', 'UUID', version);
  }

  public uppercase() {
    this.validator('isUppercase', 'uppercase');
  }

  public lowercase() {
    this.validator('isLowercase', 'lowercase');
  }

  public slug() {
    this.validator('isSlug', 'slug');
  }

  public mimeType() {
    this.validator('isMimeType', 'valid mime type');
  }

  public emptyString() {
    this.is('emptyStringOrWhitespace', 'empty string');
  }

  public falsy() {
    this.is('falsy');
  }

  public mongoId() {
    this.validator('isMongoId', 'Mongo ID');
  }

  public alphanumeric() {
    this.message.push('alphanumeric');
    this.execute(item => /^[A-Za-z0-9]+$/.test(String(item)));
  }

  public onlyLetters() {
    this.message.push('only letters');
    this.execute(item => /^[A-Za-z]+$/.test(String(item)));
  }

  public onlyNumbers() {
    this.message.push('only numbers');
    this.execute(item => /^[0-9]+$/.test(String(item)));
  }

  /**
   * NUMBERS
   */

  public greaterThan(value: number) {
    this.message.push(`greater than ${value}`);
    this.execute(item => Number(item) > value);
  }

  public greaterThanOrEquals(value: number) {
    this.message.push(`greater than or equal to ${value}`);
    this.execute(item => Number(item) >= value);
  }

  public lessThan(value: number) {
    this.message.push(`less than ${value}`);
    this.execute(item => Number(item) < value);
  }

  public lessThanOrEquals(value: number) {
    this.message.push(`less than or equal to ${value}`);
    this.execute(item => Number(item) <= value);
  }

  public between(valueA: number, valueB: number) {
    this.message.push(`between ${valueA} and ${valueB}`);
    this.execute(item => is.inRange(Number(item), [valueA, valueB]));
  }

  public closeTo(value: number, within: number = 0.01) {
    this.message.push(`close to ${value}`);
    this.execute(item =>
      is.inRange(Number(item), [value - within, value + within]),
    );
  }

  public roundTo(value: number) {
    this.message.push(`round to ${value}`);
    this.execute(item => Math.round(Number(item)) == value);
  }

  public roundUpTo(value: number) {
    this.message.push(`round up to ${value}`);
    this.execute(item => Math.ceil(Number(item)) == value);
  }

  public roundDownTo(value: number) {
    this.message.push(`round down to ${value}`);
    this.execute(item => Math.floor(Number(item)) == value);
  }

  public zero() {
    this.message.push('zero');
    this.execute(value => String(value) === '0');
  }

  public nonZeroNumber() {
    this.message.push('non-zero number');
    this.execute(value => is.number(value) && value != 0);
  }

  public nonZeroInteger() {
    this.message.push('non-zero integer');
    this.execute(value => is.integer(value) && value != 0);
  }

  public oddInteger() {
    this.is('oddInteger', 'odd integer');
  }

  public evenInteger() {
    this.is('evenInteger', 'even integer');
  }

  public divisibleBy(n: number) {
    this.validator('isDivisibleBy', `divisible by ${n}`, n);
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

  public nan() {
    this.is('nan', 'NaN');
  }

  /**
   * OBJECTS
   */

  public property(propertyName: string) {
    this.message.push(`property ${propertyName}`);
    this.execute(
      item => is.object(item) && item[propertyName] !== this.undefined,
    );
  }

  public properties(propertyNames: string[]) {
    this.message.push(`properties ${humanReadableList(propertyNames)}`);
    this.execute(
      item =>
        is.object(item) &&
        propertyNames.every(prop => item[prop] !== this.undefined),
    );
  }

  public emptyObject() {
    this.is('emptyObject', 'empty object');
  }

  /**
   * ARRAY
   */

  public arrayOf(typeName: 'string' | 'number' | 'boolean' | 'object') {
    this.message.push(`array of ${typeName}s`);
    this.execute(value => is.array(value, is[typeName as string]));
  }

  public emptyArray() {
    this.is('emptyArray', 'empty array');
  }

  /**
   * DATE
   */

  public before(date: string | Date) {
    const dateString = typeof date == 'string' ? date : Date.toString();
    this.validator('isBefore', `before ${dateString}`, dateString);
  }

  public after(date: string | Date) {
    const dateString = typeof date == 'string' ? date : Date.toString();
    this.validator('isAfter', `after ${dateString}`, dateString);
  }

  public inThePast() {
    this.validator('isBefore', 'in the past');
  }

  public inTheFuture() {
    this.validator('isAfter', 'in the future');
  }
}

export function test<ValueWrapper extends ValueInterface>(
  input: ValueWrapper,
  type: mustOrShould,
): Test<ValueWrapper> {
  return new Test(input, type);
}
