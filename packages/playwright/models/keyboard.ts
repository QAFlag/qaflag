import { KeyboardInterface, sleep } from '@qaflag/core';
import { PlaywrightValue } from './playwright.value';

export type KeyboardOpts = {
  delay?: number | undefined;
  noWaitAfter?: boolean | undefined;
  timeout?: number | undefined;
};

type SpecialKeys =
  | 'Backspace'
  | 'Tab'
  | 'Delete'
  | 'Escape'
  | 'ArrowDown'
  | 'ArrowRight'
  | 'ArrowUp'
  | 'ArrowLeft'
  | 'Escape'
  | 'Enter'
  | 'Insert'
  | 'PageDown'
  | 'PageUp'
  | 'CapsLock'
  | 'End'
  | 'Home'
  | 'F1'
  | 'F2'
  | 'F3'
  | 'F4'
  | 'F5'
  | 'F6'
  | 'F7'
  | 'F8'
  | 'F9'
  | 'F10'
  | 'F11'
  | 'F12';

type MetaKeys = 'Shift' | 'Control' | 'Alt' | 'Meta' | 'ShiftLeft';
interface RepeatPress {
  count?: number;
  delayMs?: number;
}

type PressedKeys =
  | SpecialKeys
  | string
  | [meta: MetaKeys, key: SpecialKeys | string];

export class Keyboard implements KeyboardInterface {
  constructor(private locator: PlaywrightValue) {}

  public async input(text: string, opts?: KeyboardOpts) {
    this.locator.logger.action('INPUT', this.locator, text);
    return this.locator.first.$.type(text, opts);
  }

  public async inputMasked(text: string, opts?: KeyboardOpts) {
    this.locator.logger.action(
      'INPUT',
      this.locator,
      ''.padStart(text.length, '*'),
    );
    return this.locator.first.$.type(text, opts);
  }

  public async press(key: PressedKeys, opts?: KeyboardOpts) {
    const keyCode = Array.isArray(key) ? key.join('+') : key;
    this.locator.logger.action('PRESS', this.locator, keyCode);
    return this.locator.first.$.press(keyCode, opts);
  }

  public async down(key: PressedKeys) {
    const keyCode = Array.isArray(key) ? key.join('+') : key;
    this.locator.logger.action('DOWN', this.locator, keyCode);
    return this.locator.first.$.page().keyboard.down(keyCode);
  }

  public async up(key: PressedKeys, opts?: KeyboardOpts) {
    const keyCode = Array.isArray(key) ? key.join('+') : key;
    this.locator.logger.action('UP', this.locator, keyCode);
    return this.locator.first.$.page().keyboard.up(keyCode);
  }

  public async selectAll() {
    return this.press(['Meta', 'A']);
  }

  public async copy() {
    return this.press(['Meta', 'C']);
  }

  public async paste() {
    return this.press(['Meta', 'V']);
  }

  public async cut() {
    return this.press(['Meta', 'X']);
  }

  public async backspace(opts?: RepeatPress) {
    return this.pressSpecial('Backspace', opts);
  }

  public async enter(opts?: RepeatPress) {
    return this.pressSpecial('Enter', opts);
  }

  public async delete(opts?: RepeatPress) {
    return this.pressSpecial('Delete', opts);
  }

  public async escape(opts?: RepeatPress) {
    return this.pressSpecial('Escape', opts);
  }

  public async tab(opts?: RepeatPress) {
    return this.pressSpecial('Tab', opts);
  }

  public async arrowDown(opts?: RepeatPress) {
    return this.pressSpecial('ArrowDown', opts);
  }

  public async arrrowUp(opts?: RepeatPress) {
    return this.pressSpecial('ArrowUp', opts);
  }

  public async arrowLeft(opts?: RepeatPress) {
    return this.pressSpecial('ArrowLeft', opts);
  }

  public async arrowRight(opts?: RepeatPress) {
    return this.pressSpecial('ArrowRight', opts);
  }

  public async pressSpecial(key: SpecialKeys, opts?: RepeatPress) {
    const count = opts?.count || 1;
    for (let i = 0; i < count; i++) {
      await this.press(key);
      await sleep(opts?.delayMs || 10);
    }
    return this;
  }
}
