import { ValueInterface } from '../types/value.interface';

interface ValueTypeOpts {
  name: string;
}

interface ValueOpts {
  name: string;
}

export function ValueType(initOpts: ValueTypeOpts) {
  abstract class ValueAbstract<InputType> implements ValueInterface<InputType> {
    #input: InputType | undefined;

    constructor(input: InputType | undefined, protected opts: ValueOpts) {
      this.#input = input;
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
  }
  return ValueAbstract;
}
