import { FormInterface, StringValue } from '@qaflag/core';
import { ElementHandle } from 'playwright';
import { TimeoutOpts } from '../types/timeout-opts';
import { PagePosition } from './bounding-box.value';
import { PlaywrightValue } from './playwright.value';

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

  public async value(opts?: TimeoutOpts) {
    return new StringValue(await this.locator.first.$.inputValue(), {
      logger: this.locator.logger,
      name: `Value of ${this.locator.name}`,
    });
  }

  public async select(
    values:
      | string
      | string[]
      | {
          value?: string | undefined;
          label?: string | undefined;
          index?: number | undefined;
        },
    opts?: FormOpts,
  ) {
    this.locator.logger.action('SELECT', this.locator, values.toString());
    return this.locator.first.$.selectOption(values, opts);
  }

  public async selectByText(text: string | RegExp, opts?: FormOpts) {
    const optionToSelect = await this.locator.first
      .locator('option', {
        hasText: text,
      })
      .textContent();
    return this.select({ label: optionToSelect.$ });
  }

  public async file(files: InputFiles, opts?: FormOpts) {
    this.locator.logger.action('FILE', this.locator, files.toString());
    return this.locator.first.$.setInputFiles(files, opts);
  }
}
