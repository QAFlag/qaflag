import { ArrayValue, BooleanValue, NumericValue, StringValue } from './values';
import { LoggerInterface } from '../types/log-provider.interface';
import { Must } from '../test/test.interface';

export interface ValueInterface<InputType = any> {
  $: InputType;
  name: string;
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
  must: Must;
  should: Must;
}

export interface FormInterface {
  check(isChecked: boolean): Promise<void>;
  select(value: string | string[]): Promise<string[]>;
  input(text: string): Promise<void>;
  file(path: string | string[]): Promise<void>;
}

export interface KeyboardInterface {
  input(text: string): Promise<void>;
  press(text: string): Promise<void>;
  down(text: string): Promise<void>;
  up(text: string): Promise<void>;
}

export interface PointerInterface {
  click(): Promise<void>;
  doubleClick(): Promise<void>;
  hover(): Promise<void>;
  longPress(): Promise<void>;
  selectText(): Promise<void>;
  dragTo(destination: any): Promise<void>;
}

export interface UiElementInterface<InputType>
  extends ValueInterface<InputType> {
  first: UiElementInterface<InputType>;
  last: UiElementInterface<InputType>;
  keyboard?: KeyboardInterface;
  mouse?: PointerInterface;
  touch?: PointerInterface;
  form?: FormInterface;
  nth(i: number): UiElementInterface<InputType>;
  find(selector: string): UiElementInterface<InputType>;
  text(): StringValue | Promise<StringValue>;
  count(): NumericValue | Promise<NumericValue>;
  value():
    | StringValue
    | ArrayValue<string>
    | Promise<StringValue | ArrayValue<string>>;
  attribute(name: string): StringValue | Promise<StringValue>;
  tagName(): StringValue | Promise<StringValue>;
}
