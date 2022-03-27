import { LogReceiver } from '../types/log-provider.interface';
import { ValueInterface } from '../types/value.interface';
import { toType } from '../utils/to-type';
import { test } from './test';

interface ValueOpts {
  name: string;
  logger: LogReceiver;
}

export abstract class ValueAbstract<InputType>
  implements ValueInterface<InputType>
{
  #input: InputType | undefined;

  public logger: LogReceiver;

  constructor(input: InputType | undefined, protected opts: ValueOpts) {
    this.#input = input;
    this.logger = opts.logger;
  }

  public get $(): InputType {
    return this.#input;
  }

  public get name(): string {
    return this.opts.name;
  }

  public get length(): NumericValue {
    return new NumericValue(this.#input['length'] ? this.#input['length'] : 0, {
      name: `Length of ${this.name}`,
      logger: this.logger,
    });
  }

  public get is() {
    return test(this);
  }

  public get type() {
    return new StringValue(toType(this.#input), {
      ...this.opts,
      name: `Type of ${this.name}`,
    });
  }

  public get bool() {
    return new BooleanValue(this.isTruthy(), this.opts);
  }

  public get number() {
    return new NumericValue(this.toNumber(), this.opts);
  }

  public get string() {
    return new StringValue(this.toString(), this.opts);
  }

  public get array() {
    return new ArrayValue(this.toArray(), this.opts);
  }

  public isTruthy(): boolean {
    return !!this.#input;
  }

  public isUndefined(): boolean {
    return this.#input === undefined;
  }

  public isNull(): boolean {
    return this.#input === null;
  }

  public toString(): string {
    return typeof this.#input == 'string'
      ? this.#input
      : JSON.stringify(this.#input);
  }

  public toArray(): any[] {
    return Array.isArray(this.#input) ? this.#input : [this.#input];
  }

  public toNumber(): number {
    return Number(this.#input);
  }
}

export class GenericValue extends ValueAbstract<any> {}

export class BooleanValue extends ValueAbstract<boolean> {}

export class ArrayValue<T = any> extends ValueAbstract<T[]> {
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
}

export class NumericValue extends ValueAbstract<number> {}

export class StringValue extends ValueAbstract<string> {
  public get trim() {
    return new StringValue(this.$.trim(), {
      ...this.opts,
      name: `Trimmed ${this.name}`,
    });
  }
}
