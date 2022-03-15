import { ValueType } from '../mixin/value.mixin';

export class Value extends ValueType({ name: 'Generic Value' })<any> {}

export class NumericValue extends ValueType({
  name: 'Numeric Value',
})<number> {}

export class StringValue extends ValueType({
  name: 'String Value',
})<string> {}
