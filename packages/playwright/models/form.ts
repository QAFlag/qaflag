import {
  BooleanValue,
  FormInterface,
  NumericValue,
  StringMapValue,
  StringValue,
  HHmm_24,
  YYYYMMDD,
} from '@qaflag/core';
import { ElementHandle } from 'playwright';
import { extractText } from '../selectors/extract-text';
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

export type BufferUploadFile = {
  name: string;
  mimeType: string;
  buffer: Buffer;
};

export type InputFiles =
  | string
  | string[]
  | BufferUploadFile
  | BufferUploadFile[];

export class Form extends ValueDevice implements FormInterface {
  public async isChecked(): Promise<BooleanValue> {
    return new BooleanValue(await this.locator.isChecked(), {
      name: `Is ${this.input.name} checked?`,
      context: this.input.context,
    });
  }

  public async check(isChecked: boolean = true) {
    this.logger.action(isChecked ? 'CHECK' : 'UNCHECK', this.input);
    return this.locator.setChecked(isChecked);
  }

  public async fill(value: string) {
    this.logger.action('FILL', this.input, value);
    return this.locator.fill(value);
  }

  public async chooseDate(value: YYYYMMDD) {
    this.logger.action('DATE', this.input, value);
    return this.locator.fill(value);
  }

  public async chooseTime(value: HHmm_24) {
    this.logger.action('TIME', this.input, value);
    return this.locator.fill(value);
  }

  public async clear() {
    this.logger.action('CLEAR', this.input);
    return this.locator.fill('');
  }

  public async value() {
    return new StringValue(await this.locator.inputValue(), {
      context: this.context,
      name: `Value of ${this.input.name}`,
    });
  }

  public async chooseOption(
    value: number | string | string[] | DropdownSelector,
  ) {
    const selectThis = (() => {
      if (typeof value == 'string') {
        const text = extractText(value);
        if (text) return { label: text.value };
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
    return this.locator.selectOption(selectThis);
  }

  public async selectedIndex() {
    const tagName = await this.input.tagName();
    if (tagName.$ == 'SELECT') {
      return new NumericValue(
        await this.input.first.$.evaluate(
          (sel: HTMLSelectElement) => sel.options.selectedIndex,
        ),
        {
          name: `Selected Index of ${this.input.name}`,
          context: this.context,
        },
      );
    }
    throw 'Not a <SELECT> element.';
  }

  public async selectedText() {
    const selected = await this.selectedOption();
    return new StringValue(selected.$.text, {
      name: `Selected Text of ${this.input.name}`,
      context: this.context,
    });
  }

  public async selectedOption() {
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

  public async chooseFile(files: InputFiles) {
    const fileNames: string[] = (() => {
      if (typeof files === 'string') return [files];
      if (Array.isArray(files)) {
        return files.map((file: string | BufferUploadFile) =>
          typeof file == 'string' ? file : file.name,
        );
      }
      return [files.name];
    })();

    const [fileChooser] = await Promise.all([
      this.context.page.waitForEvent('filechooser'),
      this.input.action.click(),
    ]);
    if (fileNames.length > 1 && !fileChooser.isMultiple()) {
      throw `${this.input.name} does not allow multiple files to be selected.`;
    }
    fileNames.forEach(file => this.logger.action('FILE', this.input, file));
    return fileChooser.setFiles(files);
  }
}
