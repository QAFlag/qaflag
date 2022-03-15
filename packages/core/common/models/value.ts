import { ValueType } from '../mixin/value.mixin';

export class Value extends ValueType({ name: 'Generic Value' })<any> {}

export class NumericValue extends ValueType({
  name: 'Numeric Value',
})<number> {}

export class StringValue extends ValueType({
  name: 'String Value',
})<string> {}

export class BooleanValue extends ValueType({
  name: 'Boolean Value',
})<boolean> {}

export class ArrayValue<T = any> extends ValueType({
  name: 'Array Value',
})<T[]> {
  public get first() {
    return new Value(this.$[0], {
      ...this.opts,
      name: `First in ${this.name}`,
    });
  }
}
