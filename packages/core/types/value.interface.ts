import {
  ArrayValue,
  BooleanValue,
  NumericValue,
  StringValue,
} from '../models/values';
import { LogProvider } from './log-provider.interface';

export interface ValueInterface<InputType = any> {
  $: InputType;
  name: string;
  logger: LogProvider;
  number: NumericValue;
  string: StringValue;
  array: ArrayValue;
  bool: BooleanValue;
}
