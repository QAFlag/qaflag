import validator from 'validator';
import is from '@sindresorhus/is';
import { TestEvalEnum } from './test-base';
import { levenshtein } from './utils/levenshtein';
import { isValueInterface } from './utils/is-value-interface';

export type evaluator = (data: unknown) => boolean;
export const assert = (value: any) => new Assertion(value);
export type AssertionOpts = {
  isNot: boolean;
  evalType: TestEvalEnum;
  howMany: number;
};

const toArray = (value: any): any[] => {
  return Array.isArray(value) ? value : [value];
};

export class Assertion {
  public readonly input: any;
  protected isNot: boolean;
  protected evalType: TestEvalEnum;
  protected howMany: number;

  constructor(input: any, opts?: AssertionOpts) {
    this.input = isValueInterface(input) ? input.$ : input;
    this.isNot = opts?.isNot ?? false;
    this.evalType = opts?.evalType ?? 'standard';
    this.howMany = opts?.howMany ?? 0;
  }

  public validator(methodName: keyof typeof validator, opts?: any) {
    const method = validator[methodName] as Function;
    return this.execute(item => method(String(item), opts));
  }

  public is(methodName: keyof typeof is) {
    const method = is[methodName] as Function;
    return this.execute(value => {
      return method(value);
    });
  }

  public execute(assertion: evaluator): boolean {
    const result = (() => {
      if (this.evalType === 'standard') return assertion(this.input);
      const thisArray = toArray(this.input);
      if (this.evalType === 'every') {
        return thisArray.every((item: any) => assertion(item));
      }
      if (this.evalType === 'some') {
        return thisArray.some((item: any) => assertion(item));
      }
      const count = thisArray.filter((item: any) => assertion(item)).length;
      if (this.evalType === 'atLeast') return count >= this.howMany;
      if (this.evalType === 'atMost') return count <= this.howMany;
      return count === this.howMany;
    })();
    return this.isNot ? !result : result;
  }

  public equals(value: any) {
    return this.execute(item => item == value);
  }

  public isExactly(value: any) {
    return this.execute(item => item === value);
  }

  public arrayIncludes(value: any) {
    return this.execute(item => toArray(item).includes(value));
  }

  public isInArray(value: any[]) {
    return this.execute(thisValue => value.includes(thisValue));
  }

  public containedIn(value: any) {
    return this.execute(thisValue => {
      if (typeof thisValue == 'string') {
        return Array.isArray(value)
          ? value.some(x => validator.contains(x, thisValue))
          : validator.contains(value, thisValue);
      }
      if (Array.isArray(thisValue)) {
        return thisValue.some(x => value.includes(String(x)));
      }
      // Convert to string
      return Array.isArray(value)
        ? value.some(x => validator.contains(String(x), String(thisValue)))
        : validator.contains(value, String(thisValue));
    });
  }

  public contains(value: any) {
    return this.execute(thisValue => {
      if (typeof thisValue == 'string') {
        return Array.isArray(value)
          ? value.some(x => validator.contains(thisValue, x))
          : validator.contains(thisValue, value);
      }
      if (Array.isArray(thisValue)) {
        return Array.isArray(value)
          ? thisValue.some(x => value.includes(x))
          : thisValue.includes(value);
      }
      // Convert to string
      return Array.isArray(value)
        ? value.some(x => validator.contains(String(thisValue), x))
        : validator.contains(String(thisValue), value);
    });
  }

  public exists() {
    return this.execute(value => {
      if (value === null || value === undefined) return false;
      if (typeof value == 'number' && value <= 0) return false;
      if (Array.isArray(value) && value.length == 0) return false;
      if (value === false) return false;
      return true;
    });
  }

  public isTrue() {
    return this.execute(item => item === true);
  }

  public isFalse() {
    return this.execute(item => item === false);
  }

  public isNullOrUndefined() {
    return this.is('nullOrUndefined');
  }

  public isNull() {
    return this.is('null_');
  }

  public isUndefined() {
    return this.is('undefined');
  }

  public isBoolean() {
    return this.is('boolean');
  }

  public isTruthy() {
    return this.is('truthy');
  }

  public isEmpty() {
    if (is.array(this.input)) return this.is('emptyArray');
    if (is.object(this.input)) return this.is('emptyObject');
    return this.is('emptyString');
  }

  public isType(typeName: string) {
    return this.execute(
      value => is(value).toLocaleLowerCase() == typeName.toLocaleLowerCase(),
    );
  }

  public isDate() {
    return this.validator('isDate');
  }

  public isInteger() {
    return this.validator('isInt');
  }

  public isString() {
    return this.is('string');
  }

  public isObject() {
    return this.is('plainObject');
  }

  public isArray() {
    return this.is('array');
  }

  public isNumber() {
    return this.is('number');
  }

  public isNumeric() {
    return this.is('numericString');
  }

  public isLikeString(value: string) {
    return this.execute(
      item =>
        String(item).toLocaleLowerCase().trim() ===
        value.toLocaleLowerCase().trim(),
    );
  }

  public isSimilarTo(value: string, maxDistance = 3) {
    return this.execute(
      item =>
        levenshtein(
          String(item).toLocaleLowerCase().trim(),
          value.toLocaleLowerCase().trim(),
        ) <= maxDistance,
    );
  }

  public startsWith(value: string | string[]) {
    return this.execute(item => {
      const str = String(item);
      return Array.isArray(value)
        ? value.some(x => str.startsWith(String(x)))
        : str.startsWith(String(value));
    });
  }

  public endsWith(value: string | string[]) {
    return this.execute(item => {
      const str = String(item);
      return Array.isArray(value)
        ? value.some(x => str.endsWith(String(x)))
        : str.endsWith(String(value));
    });
  }

  public matchesPattern(value: RegExp) {
    return this.execute(item => validator.matches(String(item), value));
  }

  public isEmailAddress() {
    return this.validator('isEmail');
  }

  public isCreditCard() {
    return this.validator('isCreditCard');
  }

  public isNumericString() {
    return this.is('numericString');
  }

  public isIpAddress(version?: number) {
    return this.validator('isIP', version);
  }

  public isUrl() {
    return this.is('urlString');
  }

  public isJwt() {
    return this.validator('isJWT');
  }

  public isMd5() {
    return this.validator('isMD5');
  }

  public isPostalCode(countryCode: string) {
    return this.validator('isPostalCode', countryCode);
  }

  public isUuid(version?: number) {
    return this.validator('isUUID', version);
  }

  public isUppercase() {
    return this.validator('isUppercase');
  }

  public isLowercase() {
    return this.validator('isLowercase');
  }

  public isSlug() {
    return this.validator('isSlug');
  }

  public isMimeType() {
    return this.validator('isMimeType');
  }

  public isEmptyString() {
    return this.is('emptyStringOrWhitespace');
  }

  public isFalsy() {
    return this.is('falsy');
  }

  public isMongoId() {
    return this.validator('isMongoId');
  }

  public isAlphanumeric() {
    return this.execute(item => /^[A-Za-z0-9]+$/.test(String(item)));
  }

  public isOnlyLetters() {
    return this.execute(item => /^[A-Za-z]+$/.test(String(item)));
  }

  public isOnlyNumbers() {
    return this.execute(item => /^[0-9]+$/.test(String(item)));
  }

  public isGreaterThan(value: number) {
    return this.execute(item => Number(item) > value);
  }

  public isGreaterThanOrEquals(value: number) {
    return this.execute(item => Number(item) >= value);
  }

  public isLessThan(value: number) {
    return this.execute(item => Number(item) < value);
  }

  public isLessThanOrEquals(value: number) {
    return this.execute(item => Number(item) <= value);
  }

  public isInRange(valueA: number, valueB: number) {
    return this.execute(item => is.inRange(Number(item), [valueA, valueB]));
  }

  public isCloseTo(value: number, within: number = 0.01) {
    return this.execute(item =>
      is.inRange(Number(item), [value - within, value + within]),
    );
  }

  public roundsTo(value: number) {
    return this.execute(item => Math.round(Number(item)) == value);
  }

  public roundsUpTo(value: number) {
    return this.execute(item => Math.ceil(Number(item)) == value);
  }

  public roundsDownTo(value: number) {
    return this.execute(item => Math.floor(Number(item)) == value);
  }

  public isZero() {
    return this.execute(value => String(value) === '0');
  }

  public isNonZeroNumber() {
    return this.execute(value => is.number(value) && value != 0);
  }

  public isNonZeroInteger() {
    return this.execute(value => is.integer(value) && value != 0);
  }

  public isOddInteger() {
    return this.is('oddInteger');
  }

  public isEvenInteger() {
    return this.is('evenInteger');
  }

  public isDivisibleBy(n: number) {
    return this.validator('isDivisibleBy', n);
  }

  public isPositiveNumber() {
    return this.execute(item => Number(item) > 0);
  }

  public isPositiveInteger() {
    return this.execute(value => is.integer(value) && Number(value) > 0);
  }

  public isNegativeNumber() {
    return this.execute(item => Number(item) < 0);
  }

  public isNegativeInteger() {
    return this.execute(value => is.integer(value) && Number(value) < 0);
  }

  public isNan() {
    return this.is('nan');
  }

  public hasProperty(propertyName: string) {
    return this.execute(
      item => is.object(item) && item[propertyName] !== undefined,
    );
  }

  public hasProperties(propertyNames: string[]) {
    return this.execute(
      item =>
        is.object(item) &&
        propertyNames.every(prop => item[prop] !== undefined),
    );
  }

  public isEmptyObject() {
    return this.is('emptyObject');
  }

  public isArrayOf(
    typeName: 'string' | 'number' | 'boolean' | 'object' | 'array',
  ) {
    return this.execute(value => is.array(value, is[typeName as string]));
  }

  public isEmptyArray() {
    return this.is('emptyArray');
  }

  public isBeforeDate(date: string | Date) {
    const dateString = typeof date == 'string' ? date : Date.toString();
    return this.validator('isBefore', dateString);
  }

  public isAfterDate(date: string | Date) {
    const dateString = typeof date == 'string' ? date : Date.toString();
    return this.validator('isAfter', dateString);
  }

  public inThePast() {
    return this.validator('isBefore');
  }

  public inTheFuture() {
    return this.validator('isAfter');
  }
}
