import { KeyboardInterface } from '@qaflag/core';
import { PlaywrightValue } from './playwright.value';

export type KeyboardOpts = {
  delay?: number | undefined;
  noWaitAfter?: boolean | undefined;
  timeout?: number | undefined;
};

export class Keyboard implements KeyboardInterface {
  constructor(private locator: PlaywrightValue) {}

  public async input(text: string, opts?: KeyboardOpts) {
    this.locator.logger.log('action', `INPUT: ${text}`);
    return this.locator.$.type(text, opts);
  }

  public async press(key: string, opts?: KeyboardOpts) {
    this.locator.logger.log('action', `PRESS: ${key}`);
    return this.locator.$.press(key, opts);
  }

  public async down(key: string) {
    this.locator.logger.log('action', `DOWN: ${key}`);
    return this.locator.$.page().keyboard.down(key);
  }

  public async up(key: string, opts?: KeyboardOpts) {
    this.locator.logger.log('action', `UP: ${key}`);
    return this.locator.$.page().keyboard.up(key);
  }
}
