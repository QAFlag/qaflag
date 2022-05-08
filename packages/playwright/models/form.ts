import { FormInterface } from '@qaflag/core';
import { ElementHandle } from 'playwright';
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
    return this.locator.$.setChecked(isChecked, opts);
  }

  public async input(value: string, opts?: FormOpts) {
    this.locator.logger.action('FILL', this.locator, value);
    return this.locator.$.fill(value, opts);
  }

  public async select(values: string | string[], opts?: FormOpts) {
    return this.locator.$.selectOption(values, opts);
  }

  public async file(files: InputFiles, opts?: FormOpts) {
    return this.locator.$.setInputFiles(files, opts);
  }
}
