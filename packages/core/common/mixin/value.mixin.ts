import { ArrayValue, NumericValue, StringValue } from '../models/value';
import { LogReceiver } from '../types/log-provider.interface';
import { ValueInterface } from '../types/value.interface';

interface ValueTypeOpts {
  name: string;
}

interface ValueOpts {
  name: string;
  logger: LogReceiver;
}

export function ValueType(initOpts: ValueTypeOpts) {
  abstract class ValueAbstract<InputType> implements ValueInterface<InputType> {
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

    public get valueType(): string {
      return initOpts.name;
    }

    public get length(): NumericValue {
      return new NumericValue(
        this.#input['length'] ? this.#input['length'] : 0,
        {
          name: `Length of ${this.name}`,
          logger: this.logger,
        },
      );
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
  return ValueAbstract;
}
