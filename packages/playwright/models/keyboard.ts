import { sleep } from '@qaflag/core';
import { ValueDevice } from './value-device';

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

export class Keyboard extends ValueDevice {
  public async type(text: string, opts?: KeyboardOpts) {
    this.logger.action('INPUT', this.input, text);
    await this.locator.type(text, opts);
    return this.input;
  }

  public async typeMasked(text: string, opts?: KeyboardOpts) {
    this.logger.action('INPUT', this.input, ''.padStart(text.length, '*'));
    await this.locator.type(text, opts);
    return this.input;
  }

  public async press(key: PressedKeys, opts?: KeyboardOpts) {
    const keyCode = Array.isArray(key) ? key.join('+') : key;
    this.logger.action('PRESS', this.input, keyCode);
    await this.locator.press(keyCode, opts);
    return this.input;
  }

  public async down(key: PressedKeys) {
    const keyCode = Array.isArray(key) ? key.join('+') : key;
    this.logger.action('DOWN', this.input, keyCode);
    await this.page.keyboard.down(keyCode);
    return this.input;
  }

  public async up(key: PressedKeys, opts?: KeyboardOpts) {
    const keyCode = Array.isArray(key) ? key.join('+') : key;
    this.logger.action('UP', this.input, keyCode);
    await this.page.keyboard.up(keyCode);
    return this.input;
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
    return this.input;
  }
}
