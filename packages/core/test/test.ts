import { ValueInterface } from '../value/value.interface';
import validator from 'validator';
import is from '@sindresorhus/is';
import { humanReadableList } from '../utils/helpers';
import { ArrayValue, NumericValue, StringValue } from '../value/values';
import { mustShouldCould, TestEvalEnum } from './test-base';
import { TestResult } from './result';
import { TestInterface } from './test.interface';

export type assertion = (data: unknown) => boolean;

export class Test<ValueWrapper extends ValueInterface>
  implements TestInterface<ValueWrapper>
{
  constructor(
    public readonly input: ValueWrapper,
    protected mustShouldCould: mustShouldCould,
    protected isNot: boolean = false,
    protected evalType: TestEvalEnum = 'standard',
    protected evalCount: number = 0,
    protected message: string[] = [],
  ) {
    this.message = message || [input.name, mustShouldCould];
  }

  protected get needsResultOutput(): boolean {
    return this.mustShouldCould !== 'could';
  }

  protected get isOptional(): boolean {
    return this.mustShouldCould !== 'must';
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

  public only(count: number) {
    this.evalType = 'only';
    this.evalCount = count;
    this.message.push(`only ${count}`);
    return this;
  }

  public just(count: number) {
    this.evalType = 'only';
    this.evalCount = count;
    this.message.push(`just ${count}`);
    return this;
  }

  public atMost(count: number) {
    this.evalType = 'atMost';
    this.evalCount = count;
    this.message.push(`at most ${count}`);
    return this;
  }

  public atLeast(count: number) {
    this.evalType = 'atLeast';
    this.evalCount = count;
    this.message.push(`at least ${count}`);
    return this;
  }

  public noLessThan(count: number) {
    this.evalType = 'atLeast';
    this.evalCount = count;
    this.message.push(`no less than ${count}`);
    return this;
  }

  public moreThan(count: number) {
    this.evalType = 'atLeast';
    this.evalCount = count + 1;
    this.message.push(`more than ${count}`);
    return this;
  }

  public noMoreThan(count: number) {
    this.evalType = 'atMost';
    this.evalCount = count;
    this.message.push(`no more than ${count}`);
    return this;
  }

  public _clone(input?: ValueInterface, pushWord?: string): Test<ValueWrapper> {
    return new Test(
      input || this.input,
      this.mustShouldCould,
      this.isNot,
      this.evalType,
      this.evalCount,
      pushWord ? [...this.message, pushWord] : this.message,
    ) as Test<ValueWrapper>;
  }

  private validator(
    methodName: keyof typeof validator,
    thing: string,
    opts?: any,
  ) {
    const method = validator[methodName] as Function;
    this.message.push(thing);
    return this.execute(item => method(String(item), opts));
  }

  protected is(methodName: keyof typeof is, noun?: string) {
    const method = is[methodName] as Function;
    this.message.push(noun || methodName);
    return this.execute(value => method(value));
  }

  protected execute(assertion: assertion) {
    const result = (() => {
      if (this.evalType === 'standard') return assertion(this.input.$);
      if (this.evalType === 'every') {
        return this.input.array.$.every(item => assertion(item));
      }
      if (this.evalType === 'some') {
        return this.input.array.$.some(item => assertion(item));
      }
      const count = this.input.array.$.filter(item => assertion(item)).length;
      if (this.evalType === 'atLeast') return count >= this.evalCount;
      if (this.evalType === 'atMost') return count <= this.evalCount;
      return count == this.evalCount;
    })();
    const pass = this.isNot ? !result : result;
    const text = this.message.join(' ');
    if (this.needsResultOutput) {
      this.input.logger.log(
        pass ? 'pass' : this.isOptional ? 'optionalFail' : 'fail',
        { text },
      );
      if (!pass) {
        this.input.logger.log('info', {
          text: `Actual Value: ${this.input.string.$}`,
        });
      }
    }
    return new TestResult(this, pass);
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
      return this._clone(
        new NumericValue(length, {
          name: `Length of ${this.input.name}`,
          context: this.input.context,
        }),
        'length',
      );
    }
    return this._clone(
      new ArrayValue(Array.isArray(length) ? length : [length], {
        name: `Lengths of ${this.input.name}`,
        context: this.input.context,
      }),
      'length',
    );
  }

  /**
   * GENERIC
   */

  public equal(value: any) {
    this.message.push(`equal ${value}`);
    return this.execute(item => item == value);
  }

  public equalTo(value: any) {
    this.message.push(`equal to ${value}`);
    return this.execute(item => item == value);
  }

  public exactly(value: any) {
    const thatValue = value instanceof StringValue ? value.$ : value;
    this.message.push(`exactly ${thatValue}`);
    return this.execute(item => item === thatValue);
  }

  public include(value: any) {
    this.message.push(`include ${value}`);
    return this.execute(item =>
      (Array.isArray(item) ? item : [item]).includes(value),
    );
  }

  public containedIn(value: string | string[] | StringValue) {
    const thatValue = value instanceof StringValue ? value.$ : value;
    this.message.push(`contained in ${thatValue}`);
    return this.execute(thisValue => {
      if (typeof thisValue == 'string') {
        return Array.isArray(thatValue)
          ? thatValue.some(x => validator.contains(x, thisValue))
          : validator.contains(thatValue, thisValue);
      }
      if (Array.isArray(thisValue)) {
        return thisValue.some(x => thatValue.includes(x));
      }
      // Convert to string
      return Array.isArray(thatValue)
        ? thatValue.some(x => validator.contains(x, String(thisValue)))
        : validator.contains(thatValue, String(thisValue));
    });
  }

  public contain(value: string | string[] | StringValue) {
    const thatValue = value instanceof StringValue ? value.$ : value;
    this.message.push(`contain ${thatValue}`);
    return this.execute(thisValue => {
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
    return this.execute(value => {
      if (value === null || value === undefined) return false;
      if (typeof value == 'number' && value <= 0) return false;
      if (Array.isArray(value) && value.length == 0) return false;
      if (value === false) return false;
      return true;
    });
  }

  public true() {
    this.message.push('true');
    return this.execute(item => item === true);
  }

  public false() {
    this.message.push('false');
    return this.execute(item => item === false);
  }

  public nullOrUndefined() {
    return this.is('nullOrUndefined', 'null or undefined');
  }

  public null() {
    return this.is('null_', 'null');
  }

  public undefined() {
    return this.is('undefined');
  }

  public boolean() {
    return this.is('boolean');
  }

  public truthy() {
    return this.is('truthy');
  }

  public empty() {
    return this.is('emptyStringOrWhitespace', 'empty string');
  }

  public type(typeName: string) {
    this.message.push(typeName);
    return this.execute(
      value => is(value).toLocaleLowerCase() == typeName.toLocaleLowerCase(),
    );
  }

  public date() {
    return this.validator('isDate', 'date');
  }

  public integer() {
    return this.validator('isInt', 'integer');
  }

  public string() {
    return this.is('string');
  }

  public object() {
    return this.is('object');
  }

  public array() {
    return this.is('array');
  }

  public number() {
    return this.is('number');
  }

  public numeric() {
    return this.is('numericString', 'numeric');
  }

  /**
   * STRINGS
   */

  public like(value: any) {
    this.message.push(`like ${value}`);
    return this.execute(
      item =>
        String(item).toLocaleLowerCase().trim() ===
        value.toLocaleLowerCase().trim(),
    );
  }

  public startWith(value: string | string[] | StringValue) {
    const thatValue = value instanceof StringValue ? value.$ : value;
    this.message.push(`start with ${thatValue}`);
    return this.execute(item => {
      const str = String(item);
      return Array.isArray(thatValue)
        ? thatValue.some(x => str.startsWith(x))
        : str.startsWith(thatValue);
    });
  }

  public endWith(value: string | string[] | StringValue) {
    const thatValue = value instanceof StringValue ? value.$ : value;
    this.message.push(`end with ${thatValue}`);
    return this.execute(item => {
      const str = String(item);
      return Array.isArray(thatValue)
        ? thatValue.some(x => str.endsWith(x))
        : str.endsWith(thatValue);
    });
  }

  public regularExpression(value: RegExp) {
    this.message.push(`regular expression ${value}`);
    return this.execute(item => validator.matches(String(item), value));
  }

  public email() {
    return this.validator('isEmail', 'email address');
  }

  public creditCard() {
    return this.validator('isCreditCard', 'credit card');
  }

  public numericString() {
    return this.is('numericString', 'numeric string');
  }

  public ipAddress(version?: number) {
    return this.validator('isIP', 'IP Address', version);
  }

  public url() {
    return this.is('urlString', 'URL');
  }

  public jwt() {
    return this.validator('isJWT', 'JWT');
  }

  public md5() {
    return this.validator('isMD5', 'MD5 Hash');
  }

  public postalCode(countryCode: string) {
    return this.validator(
      'isPostalCode',
      `Postal Code in ${countryCode}`,
      countryCode,
    );
  }

  public uuid(version?: number) {
    return this.validator('isUUID', 'UUID', version);
  }

  public uppercase() {
    return this.validator('isUppercase', 'uppercase');
  }

  public lowercase() {
    return this.validator('isLowercase', 'lowercase');
  }

  public slug() {
    return this.validator('isSlug', 'slug');
  }

  public mimeType() {
    return this.validator('isMimeType', 'valid mime type');
  }

  public emptyString() {
    return this.is('emptyStringOrWhitespace', 'empty string');
  }

  public falsy() {
    return this.is('falsy');
  }

  public mongoId() {
    return this.validator('isMongoId', 'Mongo ID');
  }

  public alphanumeric() {
    this.message.push('alphanumeric');
    return this.execute(item => /^[A-Za-z0-9]+$/.test(String(item)));
  }

  public onlyLetters() {
    this.message.push('only letters');
    return this.execute(item => /^[A-Za-z]+$/.test(String(item)));
  }

  public onlyNumbers() {
    this.message.push('only numbers');
    return this.execute(item => /^[0-9]+$/.test(String(item)));
  }

  /**
   * NUMBERS
   */

  public greaterThan(value: number) {
    this.message.push(`greater than ${value}`);
    return this.execute(item => Number(item) > value);
  }

  public greaterThanOrEquals(value: number) {
    this.message.push(`greater than or equal to ${value}`);
    return this.execute(item => Number(item) >= value);
  }

  public lessThan(value: number) {
    this.message.push(`less than ${value}`);
    return this.execute(item => Number(item) < value);
  }

  public lessThanOrEquals(value: number) {
    this.message.push(`less than or equal to ${value}`);
    return this.execute(item => Number(item) <= value);
  }

  public between(valueA: number, valueB: number) {
    this.message.push(`between ${valueA} and ${valueB}`);
    return this.execute(item => is.inRange(Number(item), [valueA, valueB]));
  }

  public closeTo(value: number, within: number = 0.01) {
    this.message.push(`close to ${value}`);
    return this.execute(item =>
      is.inRange(Number(item), [value - within, value + within]),
    );
  }

  public roundTo(value: number) {
    this.message.push(`round to ${value}`);
    return this.execute(item => Math.round(Number(item)) == value);
  }

  public roundUpTo(value: number) {
    this.message.push(`round up to ${value}`);
    return this.execute(item => Math.ceil(Number(item)) == value);
  }

  public roundDownTo(value: number) {
    this.message.push(`round down to ${value}`);
    return this.execute(item => Math.floor(Number(item)) == value);
  }

  public zero() {
    this.message.push('zero');
    return this.execute(value => String(value) === '0');
  }

  public nonZeroNumber() {
    this.message.push('non-zero number');
    return this.execute(value => is.number(value) && value != 0);
  }

  public nonZeroInteger() {
    this.message.push('non-zero integer');
    return this.execute(value => is.integer(value) && value != 0);
  }

  public oddInteger() {
    return this.is('oddInteger', 'odd integer');
  }

  public evenInteger() {
    return this.is('evenInteger', 'even integer');
  }

  public divisibleBy(n: number) {
    return this.validator('isDivisibleBy', `divisible by ${n}`, n);
  }

  public positiveNumber() {
    this.message.push('positive number');
    return this.execute(item => Number(item) > 0);
  }

  public positiveInteger() {
    this.message.push('positive integer');
    return this.execute(value => is.integer(value) && Number(value) > 0);
  }

  public negativeNumber() {
    this.message.push('negative number');
    return this.execute(item => Number(item) < 0);
  }

  public negativeInteger() {
    this.message.push('positive integer');
    return this.execute(value => is.integer(value) && Number(value) < 0);
  }

  public nan() {
    return this.is('nan', 'NaN');
  }

  /**
   * OBJECTS
   */

  public property(propertyName: string) {
    this.message.push(`property ${propertyName}`);
    return this.execute(
      item => is.object(item) && item[propertyName] !== this.undefined,
    );
  }

  public properties(propertyNames: string[]) {
    this.message.push(`properties ${humanReadableList(propertyNames)}`);
    return this.execute(
      item =>
        is.object(item) &&
        propertyNames.every(prop => item[prop] !== this.undefined),
    );
  }

  public emptyObject() {
    return this.is('emptyObject', 'empty object');
  }

  /**
   * ARRAY
   */

  public arrayOf(typeName: 'string' | 'number' | 'boolean' | 'object') {
    this.message.push(`array of ${typeName}s`);
    return this.execute(value => is.array(value, is[typeName as string]));
  }

  public emptyArray() {
    return this.is('emptyArray', 'empty array');
  }

  /**
   * DATE
   */

  public before(date: string | Date) {
    const dateString = typeof date == 'string' ? date : Date.toString();
    return this.validator('isBefore', `before ${dateString}`, dateString);
  }

  public after(date: string | Date) {
    const dateString = typeof date == 'string' ? date : Date.toString();
    return this.validator('isAfter', `after ${dateString}`, dateString);
  }

  public inThePast() {
    return this.validator('isBefore', 'in the past');
  }

  public inTheFuture() {
    return this.validator('isAfter', 'in the future');
  }
}

export function test<ValueWrapper extends ValueInterface>(
  input: ValueWrapper,
  type: mustShouldCould,
): Test<ValueWrapper> {
  return new Test(input, type);
}
