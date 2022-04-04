import {
  ArrayValue,
  BooleanValue,
  NumericValue,
  StringValue,
} from '../models/values';
import { LogProvider } from './log-provider.interface';
import { Must } from './test.interface';

export interface ValueInterface<InputType = any> {
  $: InputType;
  name: string;
  logger: LogProvider;
  number: NumericValue;
  string: StringValue;
  array: ArrayValue;
  boolean: BooleanValue;
  must: Must;
  should: Must;
  as(newName: string): this;
  toString(): string;
  toArray(): any[];
  toNumber(): number;
}
