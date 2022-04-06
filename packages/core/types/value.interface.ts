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
  must: any;
  should: any;
  string: StringValue;
  array: ArrayValue;
  as(newName: string): this;
}

export interface PrimitiveValueInterface<InputType = any>
  extends ValueInterface<InputType> {
  number: NumericValue;
  boolean: BooleanValue;
  must: Must;
  should: Must;
}
