import { ArrayValue, FormInterface, StringValue } from '@qaflag/core';
import { ElementHandle } from 'playwright';
import { TimeoutOpts } from '../types/timeout-opts';
import { PagePosition } from './bounding-box.value';
import { PlaywrightValue } from './playwright.value';

export interface DropdownOption {
  text: string;
  value: string;
  index: number;
  selected: boolean;
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

export class Form implements FormInterface {
  constructor(private locator: PlaywrightValue) {}

  public async check(isChecked: boolean = true, opts?: FormPointerOpts) {
    this.locator.logger.action(
      `TOGGLE`,
      this.locator,
      isChecked ? 'Check' : 'Unechek',
    );
    return this.locator.first.$.setChecked(isChecked, opts);
  }

  public async input(value: string, opts?: FormOpts) {
    this.locator.logger.action('FILL', this.locator, value);
    return this.locator.first.$.fill(value, opts);
  }

  public async text(opts?: TimeoutOpts) {
    const tagName = await this.locator.tagName();
    if (tagName.$ == 'SELECT') {
      const value = await this.locator.first.$.evaluate(
        (sel: HTMLSelectElement) =>
          sel.options[sel.options.selectedIndex].textContent,
        opts,
      );
      if (!value) throw `No text selected in ${this.locator.name}`;
      return new StringValue(value, {
        logger: this.locator.logger,
        name: `Selected Text of ${this.locator.name}`,
      });
    }
    return new StringValue(await this.locator.first.$.inputValue(opts), {
      logger: this.locator.logger,
      name: `Text of ${this.locator.name}`,
    });
  }

  public async options(
    opts?: TimeoutOpts,
  ): Promise<ArrayValue<DropdownOption>> {
    const tagName = await this.locator.tagName();
    if (tagName.$ == 'SELECT') {
      const options = await this.locator.first.$.evaluate(
        (sel: HTMLSelectElement) => sel.options,
        opts,
      );
      const dropdownOptions: DropdownOption[] = [];
      for (let i = 0; i < options.length; i++) {
        const option = options.item(i);
        if (option) {
          dropdownOptions.push({
            text: option.text,
            value: option.value,
            index: option.index,
            selected: option.selected,
          });
        }
      }
      return new ArrayValue(dropdownOptions, {
        logger: this.locator.logger,
        name: `Dropdown Options of ${this.locator.name}`,
      });
    }
    throw `${this.locator.name} is not a dropdown, can't get options`;
  }

  public async value(opts?: TimeoutOpts) {
    return new StringValue(await this.locator.first.$.inputValue(opts), {
      logger: this.locator.logger,
      name: `Value of ${this.locator.name}`,
    });
  }

  public async select(
    value:
      | number
      | string
      | string[]
      | {
          value?: string | undefined;
          label?: string | undefined;
          index?: number | undefined;
        },
    opts?: FormOpts,
  ) {
    this.locator.logger.action('SELECT', this.locator, value.toString());
    if (typeof value == 'number') {
      return this.locator.first.$.selectOption(
        {
          index: value,
        },
        opts,
      );
    }
    return this.locator.first.$.selectOption(value, opts);
  }

  public async selectByText(text: string | RegExp, opts?: FormOpts) {
    const optionToSelect = await this.locator.first
      .locator('option', {
        hasText: text,
      })
      .textContent();
    return this.select({ label: optionToSelect.$ }, opts);
  }

  public async file(files: InputFiles, opts?: FormOpts) {
    this.locator.logger.action('FILE', this.locator, files.toString());
    return this.locator.first.$.setInputFiles(files, opts);
  }
}
