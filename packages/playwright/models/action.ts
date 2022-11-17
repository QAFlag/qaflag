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

    public async selectOption(text: string) {
        await this.input.scrollTo();
        await this.input.focus();
        await this.form.select({ label: text });
        return this.input;
    }

    public async check() {
        await this.input.scrollTo();
        await this.input.focus();
        await this.form.check(true);
        return this.input;
    }

    public async uncheck() {
        await this.input.scrollTo();
        await this.input.focus();
        await this.form.check(false);
        return this.input;
    }

    public async click() {
        await this.input.scrollTo();
        await this.pointer.click();
        return this.input;
    }

  }
  