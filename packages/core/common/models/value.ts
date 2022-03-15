import { ValueType } from '../mixin/value-type.mixin';

export class GenericValue extends ValueType({ name: 'Generic Value' })<any> {}

export class NumericValue extends ValueType({
  name: 'Numeric Value',
})<number> {}

export class BooleanValue extends ValueType({
  name: 'Boolean Value',
})<boolean> {}

export class StringValue extends ValueType({
  name: 'String Value',
})<string> {
  public get trim() {
    return new StringValue(this.$.trim(), {
      ...this.opts,
      name: `Trimmed ${this.name}`,
    });
  }
}

export class ArrayValue<T = any> extends ValueType({
  name: 'Array Value',
})<T[]> {
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
