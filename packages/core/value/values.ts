import { Must } from '../test/test.interface';
import { LoggerInterface } from '../types/log-provider.interface';
import {
  ValueInterface,
  PrimitiveValueInterface,
} from '../value/value.interface';
import { toType } from '../utils/to-type';
import { test } from '../test/test';
import is from '@sindresorhus/is';

export interface ValueOpts {
  name: string;
  logger: LoggerInterface;
}

export abstract class ValueAbstract<InputType>
  implements ValueInterface<InputType>
{
  protected alias: string | undefined = undefined;
  public logger: LoggerInterface;

  constructor(protected input: InputType, protected opts: ValueOpts) {
    this.logger = opts.logger;
  }

  public get $(): InputType {
    return this.input;
  }

  public get name(): string {
    return this.alias || this.opts.name;
  }

  public abstract must: any;
  public abstract should: any;

  public get type() {
    return new StringValue(toType(this.input), {
      ...this.opts,
      name: `Type of ${this.name}`,
    });
  }

  public as(newName: string) {
    this.alias = newName;
    return this;
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

  protected toString(): string {
    return typeof this.input == 'string'
      ? this.input
      : JSON.stringify(this.input);
  }

  protected toArray(): any[] {
    return Array.isArray(this.input) ? this.input : [this.input];
  }

  protected createGeneric(data: any, opts?: Partial<ValueOpts>) {
    return new GenericValue(data, {
      logger: this.logger,
      name: this.name,
      ...opts,
    });
  }

  protected createString(str: string, opts?: Partial<ValueOpts>) {
    return new StringValue(str, {
      logger: this.logger,
      name: this.name,
      ...opts,
    });
  }

  protected createNumber(num: number, opts?: Partial<ValueOpts>) {
    return new NumericValue(num, {
      logger: this.logger,
      name: this.name,
      ...opts,
    });
  }

  protected createBoolean(bool: boolean, opts?: Partial<ValueOpts>) {
    return new BooleanValue(bool, {
      logger: this.logger,
      name: this.name,
      ...opts,
    });
  }

  protected createArray<T>(data: T[], opts?: Partial<ValueOpts>) {
    return new ArrayValue<T>(data, {
      logger: this.logger,
      name: this.name,
      ...opts,
    });
  }
}

export abstract class PrimitiveValueAbstract<InputType>
  extends ValueAbstract<InputType>
  implements PrimitiveValueInterface<InputType>
{
  public get length(): NumericValue {
    return new NumericValue(this.input['length'] ? this.input['length'] : 0, {
      name: `Length of ${this.name}`,
      logger: this.logger,
    });
  }

  public get must(): Must {
    return test(this, 'must');
  }

  public get should(): Must {
    return test(this, 'should');
  }

  public get number() {
    return new NumericValue(this.toNumber(), this.opts);
  }

  public get date() {
    return new DateValue(this.toDate(), this.opts);
  }

  public get keys() {
    return new ArrayValue(Object.keys(this.$), this.opts);
  }

  public get values() {
    return new ArrayValue(Object.values(this.$), this.opts);
  }

  public get entries() {
    return new ArrayValue(Object.entries(this.$), this.opts);
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
}

export class GenericValue extends PrimitiveValueAbstract<any> {}

export class BooleanValue extends PrimitiveValueAbstract<boolean> {}

export class ArrayValue<T = any> extends PrimitiveValueAbstract<T[]> {
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
}

export class NumericValue extends PrimitiveValueAbstract<number> {}

export class StringValue extends PrimitiveValueAbstract<string> {
  public get trim() {
    return new StringValue(this.$.trim(), {
      ...this.opts,
      name: `Trimmed ${this.name}`,
    });
  }
}

export class DateValue extends PrimitiveValueAbstract<Date> {
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
