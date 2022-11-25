import { ValueInterface } from '../value/value.interface';
import { humanReadableList } from '../utils/helpers';
import { ArrayValue, NumericValue } from '../value/values';
import { mustShouldCould, TestBase } from './test-base';
import { TestInterface } from './test.interface';
import { isValueInterface } from './utils/is-value-interface';
import { Assertion } from './assertion';

export class Test<ValueWrapper extends ValueInterface>
  extends TestBase<ValueWrapper>
  implements TestInterface<ValueWrapper>
{
  protected get assertion() {
    return new Assertion(this.input, this.opts);
  }

  public _clone(): Test<ValueWrapper> {
    return this._copy(this.input);
  }

  public _copy<T extends ValueInterface>(input: T, pushWord?: string): Test<T> {
    return new Test(
      input,
      this.mustShouldCould,
      this.opts,
      pushWord ? [...this.message, pushWord] : this.message,
    );
  }

  /**
   * CONVERSIONS
   */

  public get length(): Test<NumericValue> {
    const length = Array.isArray(this.input.$)
      ? this.input.$.length
      : String(this.input.$).length;
    return this._copy(
      new NumericValue(length, {
        name: `Length of ${this.input.name}`,
        context: this.input.context,
      }),
      'length',
    );
  }

  public get lengths(): Test<ArrayValue> {
    const getLength = (item: unknown) =>
      Array.isArray(item) ? item.length : String(item).length;
    const length =
      this.opts.evalType == 'standard'
        ? getLength(this.input.$)
        : this.input.array.$.map(item => getLength(item));
    return this._copy(
      new ArrayValue(Array.isArray(length) ? length : [length], {
        name: `Lengths of ${this.input.name}`,
        context: this.input.context,
      }),
      'length',
    );
  }

  protected assert(test: keyof Assertion, word: string) {
    return this.result(this.assertion[test](), word);
  }

  public assertThat(test: keyof Assertion, thatValue: any, word: string = '') {
    const { value, name } = toThat(thatValue);
    return this.result(this.assertion[test](value), `${word} ${name}`);
  }

  /**
   * GENERIC
   */

  public equal(value: any) {
    return this.assertThat('equals', value, 'equals');
  }

  public equalTo(value: any) {
    return this.assertThat('equals', value, 'equal to');
  }

  public exactly(value: any) {
    return this.assertThat('isExactly', value, 'exactly');
  }

  public include(value: any) {
    return this.assertThat('arrayIncludes', value, 'include');
  }

  public inArray(value: any[]) {
    return this.assertThat('isInArray', value, 'in array');
  }

  public containedIn(value: any) {
    return this.assertThat('containedIn', value, 'contained in');
  }

  public contain(value: any) {
    return this.assertThat('contains', value, 'contain');
  }

  public exist() {
    return this.assert('exists', 'exist');
  }

  public true() {
    return this.assert('isTrue', 'true');
  }

  public false() {
    return this.assert('isFalse', 'false');
  }

  public nullOrUndefined() {
    return this.assert('isNullOrUndefined', 'null or undefined');
  }

  public null() {
    return this.assert('isNull', 'null');
  }

  public undefined() {
    return this.assert('isUndefined', 'undefined');
  }

  public boolean() {
    return this.assert('isBoolean', 'boolean');
  }

  public truthy() {
    return this.assert('isTruthy', 'truthy');
  }

  public empty() {
    return this.assert('isEmpty', 'empty');
  }

  public type(typeName: string) {
    return this.assertThat('isType', typeName);
  }

  public date() {
    return this.assert('isDate', 'date');
  }

  public integer() {
    return this.assert('isInteger', 'integer');
  }

  public string() {
    return this.assert('isString', 'string');
  }

  public object() {
    return this.assert('isObject', 'object');
  }

  public array() {
    return this.assert('isArray', 'array');
  }

  public number() {
    return this.assert('isNumber', 'number');
  }

  public numeric() {
    return this.assert('isNumeric', 'numeric');
  }

  /**
   * STRINGS
   */

  public like(value: any) {
    return this.assertThat('isLikeString', value, 'like');
  }

  public similarTo(thatValue: any, maxDistance = 3) {
    const { value, name } = toThat(thatValue);
    return this.result(
      this.assertion.isSimilarTo(String(value), maxDistance),
      `similar to ${name} (Max Distance: 3)`,
    );
  }

  public startWith(value: string | string[]) {
    return this.result(
      this.assertion.startsWith(value),
      `starts with ${
        Array.isArray(value) ? humanReadableList(value, ',', 'or') : value
      }`,
    );
  }

  public endWith(value: string | string[]) {
    return this.result(
      this.assertion.endsWith(value),
      `ends with ${
        Array.isArray(value) ? humanReadableList(value, ',', 'or') : value
      }`,
    );
  }

  public regularExpression(pattern: RegExp) {
    return this.assertThat('matchesPattern', pattern, 'regular expression');
  }

  public email() {
    return this.assert('isEmailAddress', 'email address');
  }

  public creditCard() {
    return this.assert('isCreditCard', 'credit card number');
  }

  public numericString() {
    return this.assert('isNumericString', 'numeric string');
  }

  public ipAddress(version?: number) {
    return this.assert('isIpAddress', 'IP Adddress');
  }

  public url() {
    return this.assert('isUrl', 'URL');
  }

  public jwt() {
    return this.assert('isJwt', 'JWT');
  }

  public md5() {
    return this.assert('isMd5', 'MD5 Hash');
  }

  public postalCode(countryCode: string) {
    return this.assertThat('isPostalCode', countryCode, 'postal code in');
  }

  public uuid(version?: number) {
    return this.assert('isUuid', 'UUID');
  }

  public uppercase() {
    return this.assert('isUppercase', 'uppercase');
  }

  public lowercase() {
    return this.assert('isLowercase', 'lowercase');
  }

  public slug() {
    return this.assert('isSlug', 'slug');
  }

  public mimeType() {
    return this.assert('isMimeType', 'valid mime type');
  }

  public emptyString() {
    return this.assert('isEmptyString', 'empty string');
  }

  public falsy() {
    return this.assert('isFalsy', 'falsy');
  }

  public mongoId() {
    return this.assert('isMongoId', 'Mongo ID');
  }

  public alphanumeric() {
    return this.assert('isAlphanumeric', 'alphanumeric');
  }

  public onlyLetters() {
    return this.assert('isOnlyLetters', 'only letters');
  }

  public onlyNumbers() {
    return this.assert('isOnlyNumbers', 'only numbers');
  }

  /**
   * NUMBERS
   */

  public greaterThan(value: number) {
    return this.assertThat('isGreaterThan', value, 'greater than');
  }

  public greaterThanOrEquals(value: number) {
    return this.assertThat(
      'isGreaterThanOrEquals',
      value,
      'greater than or equal to',
    );
  }

  public lessThan(value: number) {
    return this.assertThat('isLessThan', value, 'less than');
  }

  public lessThanOrEquals(value: number) {
    return this.assertThat(
      'isLessThanOrEquals',
      value,
      'less than or equal to',
    );
  }

  public between(valueA: number, valueB: number) {
    return this.result(
      this.assertion.isInRange(valueA, valueB),
      `beween ${valueA} and ${valueB}`,
    );
  }

  public closeTo(value: number, within: number = 0.01) {
    return this.result(
      this.assertion.isCloseTo(value, within),
      `close to ${value}`,
    );
  }

  public roundTo(value: number) {
    return this.assertThat('roundsTo', value, 'rounds to');
  }

  public roundUpTo(value: any) {
    return this.assertThat('roundsUpTo', value, 'rounds up to');
  }

  public roundDownTo(value: number) {
    return this.assertThat('roundsDownTo', value, 'rounds down to');
  }

  public zero() {
    return this.assert('isZero', 'zero');
  }

  public nonZeroNumber() {
    return this.assert('isNonZeroNumber', 'non-zero number');
  }

  public nonZeroInteger() {
    return this.assert('isNonZeroInteger', 'non-zero integer');
  }

  public odd() {
    return this.assert('isOddInteger', 'odd number');
  }

  public even() {
    return this.assert('isEvenInteger', 'even number');
  }

  public divisibleBy(value: number) {
    return this.assertThat('isDivisibleBy', value, 'divisible by');
  }

  public positiveNumber() {
    return this.assert('isPositiveNumber', 'positive number');
  }

  public positiveInteger() {
    return this.assert('isPositiveInteger', 'positive integer');
  }

  public negativeNumber() {
    return this.assert('isNegativeNumber', 'negative number');
  }

  public negativeInteger() {
    return this.assert('isNegativeInteger', 'negative integer');
  }

  public nan() {
    return this.assert('isNan', 'NaN');
  }

  /**
   * OBJECTS
   */

  public property(value: string) {
    return this.assertThat('hasProperty', value, 'property');
  }

  public properties(value: string[]) {
    return this.assertThat('hasProperties', value, 'properties');
  }

  public emptyObject() {
    return this.assert('isEmptyObject', 'empty object');
  }

  /**
   * ARRAY
   */

  public arrayOf(
    typeName: 'string' | 'number' | 'boolean' | 'object' | 'array',
  ) {
    return this.assertThat('isArrayOf', typeName, 'array of');
  }

  public emptyArray() {
    return this.assert('isEmptyArray', 'empty array');
  }

  /**
   * DATE
   */

  public before(value: string | Date) {
    return this.assertThat('isBeforeDate', value, 'before');
  }

  public after(value: string | Date) {
    return this.assertThat('isAfterDate', value, 'after');
  }

  public inThePast() {
    return this.assert('inThePast', 'in the past');
  }

  public inTheFuture() {
    return this.assert('inTheFuture', 'in the future');
  }
}

export const test = <ValueWrapper extends ValueInterface>(
  input: any,
  type: mustShouldCould = 'must',
): Test<ValueWrapper> => {
  return new Test(input, type);
};

const toThat = (value: any) => {
  return isValueInterface(value)
    ? { value: value.$, name: value.name }
    : { value, name: String(value) };
};
