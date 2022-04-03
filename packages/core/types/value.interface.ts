import {
  ArrayValue,
  BooleanValue,
  NumericValue,
  StringValue,
} from '../models/values';
import { LogProvider } from './log-provider.interface';
import { TestInterface } from './test.interface';

export interface ValueInterface<InputType = any> {
  $: InputType;
  name: string;
  logger: LogProvider;
  number: NumericValue;
  string: StringValue;
  array: ArrayValue;
  bool: BooleanValue;
  is: TestInterface;
  are: TestInterface;
  test(message?: string): TestInterface;
  equals(compareTo: any): void;
  as(newName: string): this;
  toString(): string;
  toArray(): any[];
  toNumber(): number;
}
