import { ArrayValue, BooleanValue, NumericValue, StringValue } from './values';
import { LoggerInterface } from '../types/log-provider.interface';
import { Must } from '../assertions/must.interface';
import { ContextInterface } from '../context/context.interface';

export interface ValueInterface<InputType = any> {
  $: InputType;
  name: string;
  context: ContextInterface;
  logger: LoggerInterface;
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
  must: Must<typeof this>;
  should: Must<typeof this>;
}
