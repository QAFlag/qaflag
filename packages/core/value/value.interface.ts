import { ArrayValue, BooleanValue, NumericValue, StringValue } from './values';
import { LoggerInterface } from '../types/log-provider.interface';
import { Must } from '../test/must.interface';
import { ContextInterface } from '../context/context.interface';
import { HHmm_24, YYYYMMDD } from '../types/date';

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

export interface FormInterface {
  check(isChecked: boolean): Promise<void>;
  fill(text: string): Promise<void>;
  chooseDate(value: YYYYMMDD): Promise<void>;
  chooseTime(value: HHmm_24): Promise<void>;
  chooseOption(value: string | string[]): Promise<string[]>;
  chooseFile(path: string | string[]): Promise<void>;
  value():
    | StringValue
    | ArrayValue<string>
    | Promise<StringValue | ArrayValue<string>>;
}

export interface KeyboardInterface {
  type(text: string): Promise<void>;
  typeMasked(text: string): Promise<void>;
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
  attribute(name: string): StringValue | Promise<StringValue>;
  tagName(): StringValue | Promise<StringValue>;
}
