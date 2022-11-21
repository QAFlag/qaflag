import { ValueDevice } from './value-device';

export class Action extends ValueDevice {
  protected get pointer() {
    return this.input.pointer;
  }

  protected get keyboard() {
    return this.input.keyboard;
  }

  protected get form() {
    return this.input.form;
  }
  public async clearAndType(text: string) {
    await this.input.scrollTo();
    await this.pointer.click();
    await this.keyboard.selectAll();
    await this.keyboard.backspace();
    await this.keyboard.type(text);
    return this.input;
  }

  public async chooseOption(option: number | string | string[]) {
    await this.input.scrollTo();
    await this.input.focus();
    await this.form.chooseOption(option);
    return this.input;
  }

  public async check(setChecked = true) {
    await this.input.scrollTo();
    await this.input.focus();
    await this.form.check(setChecked);
    return this.input;
  }

  public async click() {
    await this.input.scrollTo();
    await this.pointer.click();
    return this.input;
  }
}
