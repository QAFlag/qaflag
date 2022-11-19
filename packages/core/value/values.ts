import { LoggerInterface } from '../types/log-provider.interface';
import {
  ValueInterface,
  PrimitiveValueInterface,
} from '../value/value.interface';
import { toType } from '../utils/to-type';
import { Test, test } from '../test/test';
import is from '@sindresorhus/is';
import { NumberMust } from '../test/number.interface';
import { StringMust } from '../test/string.interface';
import { BooleanMust } from '../test/boolean.interface';
import { DateMust } from '../test/date.interface';
import { ArrayMust } from '../test/array.interface';
import { ordinal } from '../utils/helpers';
import { ContextInterface } from '../context/context.interface';
import { SuiteInterface } from '../suite/suite.interface';
import { ScenarioInterface } from '../scenario/scenario.interface';

export interface ValueOpts {
  name: string;
  context: ContextInterface;
}

export abstract class ValueAbstract<InputType>
  implements ValueInterface<InputType>
{
  protected _nameOverride: string | undefined = undefined;
  public readonly context: ContextInterface;

  constructor(protected readonly input: InputType, protected opts: ValueOpts) {
    this.context = opts.context;
  }

  public get scenario(): ScenarioInterface {
    return this.context.scenario;
  }

  public get suite(): SuiteInterface {
    return this.context.scenario.suite;
  }

  public get logger(): LoggerInterface {
    return this.context.logger;
  }

  public get $(): InputType {
    return this.input;
  }

  public get name(): string {
    return this._nameOverride || this.opts.name;
  }

  public abstract must: any;
  public abstract should: any;
  public abstract could: any;

  public get type() {
    return new StringValue(toType(this.input), {
      ...this.opts,
      name: `Type of ${this.name}`,
    });
  }

  public as(newName: string) {
    this._nameOverride = newName;
    return this;
  }

  public alias(name: string) {
    return this.context.set(name, this);
  }

  public get number() {
    return new NumericValue(this.toNumber(), this.opts);
  }

  public get string() {
    return new StringValue(this.toString(), this.opts);
  }

  public get boolean() {
    return new BooleanValue(this.isTruthy(), this.opts);
  }

  public get array() {
    return new ArrayValue(this.toArray(), this.opts);
  }

  public get date() {
    return new DateValue(this.toDate(), this.opts);
  }

  public get generic() {
    return new GenericValue(this, this.opts);
  }

  protected isArray(): boolean {
    return Array.isArray(this.input);
  }

  protected isTruthy(): boolean {
    return !!this.input;
  }

  protected isUndefined(): boolean {
    return this.input === undefined;
  }

  protected isNull(): boolean {
    return this.input === null;
  }

  protected isString(): boolean {
    return typeof this.input === 'string';
  }

  protected isNumber(): boolean {
    return typeof this.input === 'number';
  }

  protected isBoolean(): boolean {
    return typeof this.input === 'boolean';
  }

  protected isPrimitive(): boolean {
    return ['string', 'number', 'boolean'].includes(typeof this.input);
  }

  protected toString(): string {
    return typeof this.input == 'string'
      ? this.input
      : JSON.stringify(this.input);
  }

  protected toNumber(): number {
    return Number(this.input);
  }

  protected toArray(): any[] {
    return Array.isArray(this.input) ? this.input : [this.input];
  }

  protected toDate() {
    return new Date(this.toString());
  }

  protected createGeneric(data: any, opts?: Partial<ValueOpts>) {
    return new GenericValue(data, {
      context: this.context,
      name: this.name,
      ...opts,
    });
  }

  protected createString(str: string, opts?: Partial<ValueOpts>) {
    return new StringValue(str, {
      context: this.context,
      name: this.name,
      ...opts,
    });
  }

  protected createNumber(num: number, opts?: Partial<ValueOpts>) {
    return new NumericValue(num, {
      context: this.context,
      name: this.name,
      ...opts,
    });
  }

  protected createBoolean(bool: boolean, opts?: Partial<ValueOpts>) {
    return new BooleanValue(bool, {
      context: this.context,
      name: this.name,
      ...opts,
    });
  }

  protected createArray<T>(data: T[], opts?: Partial<ValueOpts>) {
    return new ArrayValue<T>(data, {
      context: this.context,
      name: this.name,
      ...opts,
    });
  }

  public valueOf() {
    return this.isPrimitive() ? this.input : this.toString();
  }
}

export abstract class PrimitiveValueAbstract<InputType>
  extends ValueAbstract<InputType>
  implements PrimitiveValueInterface<InputType>
{
  public get length(): NumericValue {
    return new NumericValue(this.input['length'] ? this.input['length'] : 0, {
      name: `Length of ${this.name}`,
      context: this.context,
    });
  }

  public get number() {
    return new NumericValue(this.toNumber(), this.opts);
  }

  public get date() {
    return new DateValue(this.toDate(), this.opts);
  }

  public get keys() {
    return new ArrayValue(Object.keys(this.toArrayOrObject()), this.opts);
  }

  public get values() {
    return new ArrayValue(Object.values(this.toArrayOrObject()), this.opts);
  }

  public get entries() {
    return new ArrayValue(Object.entries(this.toArrayOrObject()), this.opts);
  }

  public toObject(): object {
    return Object(this.$);
  }

  public toArray(): unknown[] {
    return Array.isArray(this.$) ? this.$ : [this.$];
  }

  public toNumber(): number {
    return Number(this.input);
  }

  public toDate(): Date {
    try {
      return is.date(this.input) ? this.input : new Date(this.toString());
    } catch {
      throw `Could not convert ${this.name} (${this.input}) to date.`;
    }
  }

  public valueOf() {
    return this.input;
  }

  public split(separator: string) {
    return new ArrayValue(this.toString().split(separator), this.opts);
  }

  public join(separator: string) {
    return new StringValue(this.toArray().join(separator), this.opts);
  }

  private toArrayOrObject() {
    return Array.isArray(this.$) ? this.$ : Object(this.$);
  }
}

export class GenericValue extends PrimitiveValueAbstract<any> {
  public get must(): Test<any> {
    return test(this, 'must');
  }

  public get should(): Test<any> {
    return test(this, 'should');
  }

  public get could(): Test<any> {
    return test(this, 'could');
  }
}

export class BooleanValue extends PrimitiveValueAbstract<boolean> {
  public get must(): BooleanMust {
    return test(this, 'must');
  }

  public get should(): BooleanMust {
    return test(this, 'should');
  }

  public get could(): BooleanMust {
    return test(this, 'could');
  }
}

export class ArrayValue<T = any> extends PrimitiveValueAbstract<T[]> {
  public get must(): ArrayMust<typeof this> {
    return test(this, 'must');
  }

  public get should(): ArrayMust<typeof this> {
    return test(this, 'should');
  }

  public get could(): ArrayMust<typeof this> {
    return test(this, 'could');
  }

  public get first() {
    return new GenericValue(this.$[0], {
      ...this.opts,
      name: `First in ${this.name}`,
    });
  }

  public get last() {
    return new GenericValue(this.$.slice(-1), {
      ...this.opts,
      name: `Last in ${this.name}`,
    });
  }

  public every(name: string, callback: (item: T) => boolean) {
    return new BooleanValue(this.$.every(callback), { ...this.opts, name });
  }

  public some(name: string, callback: (item: T) => boolean) {
    return new BooleanValue(this.$.some(callback), { ...this.opts, name });
  }

  public map<Output>(callback: (item: T) => Output) {
    return new ArrayValue(this.$.map(callback), {
      ...this.opts,
      name: `Mapped ${this.name}`,
    });
  }

  public filter(callback: (item: T) => boolean): ArrayValue<T> {
    return new ArrayValue(this.$.filter(callback), {
      ...this.opts,
      name: `Filtered ${this.name}`,
    });
  }

  public forEach(
    callback: (item: GenericValue, i?: number) => void,
  ): ArrayValue<T> {
    this.$.forEach((input, i) => {
      const opts = {
        name: `${ordinal(i + 1)} item in ${this.name}`,
        context: this.context,
      };
      callback(new GenericValue(input, opts), i);
    });
    return this;
  }

  public pluck(propertyName: string): GenericValue[] {
    return this.$.map((item, i) => {
      const opts = {
        name: `${ordinal(i + 1)} item in ${this.name}`,
        context: this.context,
      };
      return new GenericValue(item[propertyName], opts);
    });
  }
}

export class NumericValue extends PrimitiveValueAbstract<number> {
  public get must(): NumberMust {
    return test(this, 'must');
  }

  public get should(): NumberMust {
    return test(this, 'should');
  }

  public get could(): NumberMust {
    return test(this, 'could');
  }
}

export class StringValue extends PrimitiveValueAbstract<string> {
  public get must(): StringMust {
    return test(this, 'must');
  }

  public get should(): StringMust {
    return test(this, 'should');
  }

  public get could(): StringMust {
    return test(this, 'could');
  }

  public nthLine(n: number) {
    const lines = this.$.split('\n');
    return new StringValue(lines[n - 1], {
      ...this.opts,
      name: `${ordinal(n)} line of ${this.name}`,
    });
  }

  public get firstLine() {
    const lines = this.$.split('\n');
    return new StringValue(lines[0], {
      ...this.opts,
      name: `first line of ${this.name}`,
    });
  }

  public get lastLine() {
    const lines = this.$.split('\n');
    return new StringValue(lines[lines.length - 1], {
      ...this.opts,
      name: `last line of ${this.name}`,
    });
  }

  public get lines(): StringValue[] {
    const lines = this.$.split('\n');
    return lines.map(
      (line, i) =>
        new StringValue(line, {
          ...this.opts,
          name: `${ordinal(i + 1)} line of ${this.name}`,
        }),
    );
  }

  public get lineCount(): NumericValue {
    const lines = this.$.split('\n');
    return new NumericValue(lines.length, {
      ...this.opts,
      name: `Number of lines in ${this.name}`,
    });
  }

  public get trim() {
    return new StringValue(this.$.trim(), {
      ...this.opts,
      name: `Trimmed ${this.name}`,
    });
  }

  public get length(): NumericValue {
    return new NumericValue(this.$.length, {
      ...this.opts,
      name: `Length of ${this.name}`,
    });
  }
}

export class DateValue extends PrimitiveValueAbstract<Date> {
  public get must(): DateMust {
    return test(this, 'must');
  }

  public get should(): DateMust {
    return test(this, 'should');
  }

  public get could(): DateMust {
    return test(this, 'could');
  }

  public get unixTime() {
    return new NumericValue(Math.floor(this.$.getTime() / 1000), {
      ...this.opts,
      name: `${this.name} from UNIX Time`,
    });
  }

  public get hours() {
    return new NumericValue(this.$.getHours(), {
      ...this.opts,
      name: `Hours from ${this.name}`,
    });
  }

  public get minutes() {
    return new NumericValue(this.$.getMinutes(), {
      ...this.opts,
      name: `Minutes from ${this.name}`,
    });
  }

  public get seconds() {
    return new NumericValue(this.$.getSeconds(), {
      ...this.opts,
      name: `Seconds from ${this.name}`,
    });
  }

  public get month() {
    return new NumericValue(this.$.getMonth() + 1, {
      ...this.opts,
      name: `Month from ${this.name}`,
    });
  }

  public get dayOfMonth() {
    return new NumericValue(this.$.getDate(), {
      ...this.opts,
      name: `Day of Month from ${this.name}`,
    });
  }

  public get year() {
    return new NumericValue(this.$.getFullYear(), {
      ...this.opts,
      name: `Year from ${this.name}`,
    });
  }

  public get dayOfWeek() {
    return new NumericValue(this.$.getDay(), {
      ...this.opts,
      name: `Day of Week from ${this.name}`,
    });
  }

  public get utcHours() {
    return new NumericValue(this.$.getUTCHours(), {
      ...this.opts,
      name: `UTC Hours from ${this.name}`,
    });
  }

  public get utcMinutes() {
    return new NumericValue(this.$.getUTCMinutes(), {
      ...this.opts,
      name: `UTC Minutes from ${this.name}`,
    });
  }

  public get utcSeconds() {
    return new NumericValue(this.$.getUTCSeconds(), {
      ...this.opts,
      name: `UTC Seconds from ${this.name}`,
    });
  }

  public get utcMonth() {
    return new NumericValue(this.$.getUTCMonth() + 1, {
      ...this.opts,
      name: `UTC Month from ${this.name}`,
    });
  }

  public get utcDayOfMonth() {
    return new NumericValue(this.$.getUTCDate(), {
      ...this.opts,
      name: `UTC Day of Month from ${this.name}`,
    });
  }

  public get utcYear() {
    return new NumericValue(this.$.getUTCFullYear(), {
      ...this.opts,
      name: `UTC Year from ${this.name}`,
    });
  }

  public get utcDayOfWeek() {
    return new NumericValue(this.$.getUTCDay(), {
      ...this.opts,
      name: `UTC Day of Week from ${this.name}`,
    });
  }

  public get dateString() {
    return new StringValue(this.$.toDateString(), {
      ...this.opts,
      name: `Date String from ${this.name}`,
    });
  }

  public get isoDateString() {
    return new StringValue(this.$.toISOString(), {
      ...this.opts,
      name: `ISO Date String from ${this.name}`,
    });
  }

  public get timeString() {
    return new StringValue(this.$.toTimeString(), {
      ...this.opts,
      name: `Time String from ${this.name}`,
    });
  }

  public get utcString() {
    return new StringValue(this.$.toUTCString(), {
      ...this.opts,
      name: `UTC String from ${this.name}`,
    });
  }
}
