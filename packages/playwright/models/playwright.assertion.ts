import { TestBase } from '@qaflag/core';
import { Locator } from 'playwright';
import { PlaywrightValue } from './playwright.value';

export type AssertionResult = {
  pass: Promise<boolean> | boolean;
  actualValue?: string;
};

export type AwaitedAssertion = (
  data: Locator,
) => Promise<AssertionResult> | AssertionResult;
export type mustOrShould = 'must' | 'should';

export class PlaywrightAssertion extends TestBase {
  protected message: string[];
  protected isNot: boolean = false;
  protected evalType: 'standard' | 'every' | 'some' = 'standard';

  protected input: PlaywrightValue;

  constructor(
    input: PlaywrightValue,
    mustOrShould: mustOrShould,
    isNot: boolean = false,
    evalType: 'standard' | 'every' | 'some' = 'standard',
    message?: string[],
  ) {
    super(input, mustOrShould, isNot, evalType, message);
  }

  public get in() {
    this.message.push('in');
    return this;
  }

  protected async execute(assertion: AwaitedAssertion) {
    const result = await assertion(this.input.$);
    const pass = this.isNot ? !(await result.pass) : await result.pass;
    this.input.logger.log(
      pass ? 'pass' : this.mustOrShould == 'should' ? 'optionalFail' : 'fail',
      this.message.join(' '),
    );
    if (!pass || result.actualValue) {
      this.input.logger.log('info', `Actual Value: ${result.actualValue}`);
    }
  }

  public async visible() {
    this.message.push('visible');
    return this.execute(async input => {
      const isVisible = await input.isVisible();
      return { pass: isVisible };
    });
  }

  public async hidden() {
    this.message.push('hidden');
    return this.execute(() => ({ pass: this.input.$.isHidden() }));
  }

  public async checked() {
    this.message.push('checked');
    return this.execute(() => ({ pass: this.input.$.isChecked() }));
  }

  public async editable() {
    this.message.push('editable');
    return this.execute(() => ({ pass: this.input.$.isEditable() }));
  }

  public async enabled() {
    this.message.push('enabled');
    return this.execute(() => ({ pass: this.input.$.isEnabled() }));
  }

  public async disabled() {
    this.message.push('disabled');
    return this.execute(() => ({ pass: this.input.$.isDisabled() }));
  }

  public async exist() {
    this.message.push('exist');
    return this.execute(async () => {
      const count = await this.input.$.count();
      return { pass: count > 0 };
    });
  }

  public async className(name: string) {
    this.message.push(`class ${name}`);
    return this.execute(async () => {
      const classList = await this.input.classList();
      return {
        pass: classList
          .map(className => className.toUpperCase())
          .$.includes(name.toUpperCase()),
        actualValue: classList.$.join(' '),
      };
    });
  }

  public async tagName(name: string) {
    this.message.push(`tag <${name.toUpperCase()}>`);
    return this.execute(async () => {
      const tagName = (await this.input.tagName()).$.toUpperCase();
      return { pass: tagName == name.toUpperCase(), actualValue: tagName };
    });
  }

  public async value(value: string) {
    this.message.push(`value <${value}>`);
    return this.execute(async () => {
      const elementValue = await this.input.value();
      return {
        pass: elementValue.$ == value,
        actualValue: elementValue.$,
      };
    });
  }

  public async attribute(name: string, value: string) {
    this.message.push(`atribute <${name}>`);
    return this.execute(async () => {
      const attributeValue = await this.input.attribute(name);
      return {
        pass: attributeValue.$ == value,
        actualValue: attributeValue.$,
      };
    });
  }

  public async focus() {
    this.message.push('focus');
    return this.execute(async () => {
      const hasFocus = await this.input.$.evaluate(
        node => document.activeElement === node,
      );
      return { pass: hasFocus };
    });
  }
}
