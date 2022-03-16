import {
  ArrayValue,
  BooleanValue,
  NumericValue,
  StringValue,
} from '../models/values';
import { LogReceiver } from './log-provider.interface';

export interface ValueInterface<InputType = any> {
  $: InputType;
  name: string;
  logger: LogReceiver;
  number: NumericValue;
  string: StringValue;
  array: ArrayValue;
  bool: BooleanValue;
}
