import {
  BooleanValue,
  FormInterface,
  NumericValue,
  StringMapValue,
  StringValue,
} from '@qaflag/core';
import { ElementHandle } from 'playwright';
import { extractText } from '../selectors';
import { TimeoutOpts } from '../types/timeout-opts';
import { PagePosition } from './bounding-box.value';
import { ValueDevice } from './value-device';

export interface DropdownOption {
  text: string;
  value: string;
  index: number;
  selected: boolean;
}

interface DropdownSelector {
  value?: string | undefined;
  label?: string | undefined;
  index?: number | undefined;
}

export interface FormOpts {
  force?: boolean | undefined;
  noWaitAfter?: boolean | undefined;
  timeout?: number | undefined;
}

export interface FormPointerOpts extends FormOpts {
  position?: PagePosition | undefined;
  trial?: boolean | undefined;
}

export type SelectOption =
  | string
  | ElementHandle<Node>
  | string[]
  | {
      value?: string | undefined;
      label?: string | undefined;
      index?: number | undefined;
    }
  | ElementHandle<Node>[]
  | null;

export type InputFiles =
  | string
  | string[]
  | { name: string; mimeType: string; buffer: Buffer }
  | { name: string; mimeType: string; buffer: Buffer }[];

export class Form extends ValueDevice implements FormInterface {

  public async isChecked(): Promise<BooleanValue> {
    return new BooleanValue(await this.locator.isChecked(), {
      name: `Is ${this.input.name} checked?`,
      context: this.input.context,
    });
  }

  public async check(isChecked: boolean = true, opts?: FormPointerOpts) {
    this.logger.action(isChecked ? 'CHECK' : 'UNCHECK', this.input);
    return this.locator.setChecked(isChecked, opts);
  }

  public async fill(value: string, opts?: FormOpts) {
    this.logger.action('FILL', this.input, value);
    return this.locator.fill(value, opts);
  }

  public async clear(opts?: FormOpts) {
    this.logger.action('CLEAR', this.input);
    return this.locator.fill('', opts);
  }

  public async value(opts?: TimeoutOpts) {
    return new StringValue(await this.locator.inputValue(opts), {
      context: this.context,
      name: `Value of ${this.input.name}`,
    });
  }

  public async select(
    value: number | string | string[] | DropdownSelector,
    opts?: FormOpts,
  ) {
    const selectThis = (() => {
      if (typeof value == 'string') {
        const text = extractText(value);
        if (text) return { label: text.text };
        return { value };
      }
      if (typeof value == 'number') return { index: value };
      return value;
    })();
    this.input.logger.action(
      'SELECT',
      this.input,
      Array.isArray(selectThis)
        ? selectThis.toString()
        : selectThis.label || selectThis.value || `index ${selectThis.index}`,
    );
    return this.locator.selectOption(selectThis, opts);
  }

  public async selectedIndex(opts?: TimeoutOpts) {
    const tagName = await this.input.tagName();
    if (tagName.$ == 'SELECT') {
      return new NumericValue(
        await this.input.first.$.evaluate(
          (sel: HTMLSelectElement) => sel.options.selectedIndex,
          opts,
        ),
        {
          name: `Selected Index of ${this.input.name}`,
          context: this.context,
        },
      );
    }
    throw 'Not a <SELECT> element.';
  }

  public async selectedText(opts?: TimeoutOpts) {
    const selected = await this.selectedOption(opts);
    return new StringValue(selected.$.text, {
      name: `Selected Text of ${this.input.name}`,
      context: this.context,
    });
  }

  public async selectedOption(opts?: TimeoutOpts) {
    const tagName = await this.input.tagName();
    if (tagName.$ == 'SELECT') {
      const selected = await this.input.first.$.evaluate(
        (sel: HTMLSelectElement) => {
          const opt = sel.options[sel.options.selectedIndex];
          return {
            index: opt.index,
            text: opt.text,
            value: opt.value,
          };
        },
        opts,
      );
      if (!selected) throw `Nothing selected in ${this.input.name}`;
      return new StringMapValue(
        {
          index: String(selected.index),
          text: selected.text,
          value: selected.value,
        },
        {
          context: this.context,
          name: `Selected Option of ${this.input.name}`,
        },
      );
    }
    throw 'Not a <SELECT> element.';
  }

  public async file(files: InputFiles, opts?: FormOpts) {
    this.logger.action('FILE', this.input, files.toString());
    return this.locator.setInputFiles(files, opts);
  }
}
