import { PlaywrightValue } from './playwright.value';

export type AwaitedAssertion = (data: unknown) => Promise<boolean>;
export type mustOrShould = 'must' | 'should';

export class PlaywrightAssertion {
  protected message: string[];
  protected isNot: boolean = false;
  protected evalType: 'standard' | 'every' | 'some' = 'standard';

  constructor(
    protected input: PlaywrightValue,
    protected mustOrShould: mustOrShould,
  ) {
    this.message = [input.name, mustOrShould];
  }

  public get not() {
    this.isNot = !this.isNot;
    this.message.push('not');
    return this;
  }

  public get be() {
    this.message.push('be');
    return this;
  }

  public get match() {
    this.message.push('match');
    return this;
  }

  public get a() {
    this.message.push('a');
    return this;
  }

  public get an() {
    this.message.push('an');
    return this;
  }

  public get have() {
    this.message.push('have');
    return this;
  }

  public get all() {
    this.evalType = 'every';
    this.message.push('all');
    return this;
  }

  public get none() {
    this.evalType = 'some';
    this.isNot = true;
    this.message.push('none');
    return this;
  }

  public get any() {
    this.evalType = 'some';
    this.message.push('any');
    return this;
  }

  public get some() {
    this.evalType = 'some';
    this.message.push('some');
    return this;
  }

  protected async execute(assertion: AwaitedAssertion) {
    const result = await (() => {
      return assertion(this.input.$);
    })();
    const pass = this.isNot ? !result : result;
    this.input.logger.log(
      pass ? 'pass' : this.mustOrShould == 'should' ? 'optionalFail' : 'fail',
      this.message.join(' '),
    );
    if (!pass) {
      //this.input.logger.log('info', `Actual Value: ${this.input.string.$}`);
    }
  }

  public async visible() {
    this.message.push('visible');
    return this.execute(() => this.input.$.isVisible());
  }

  public async hidden() {
    this.message.push('hidden');
    return this.execute(() => this.input.$.isHidden());
  }

  public async checked() {
    this.message.push('checked');
    return this.execute(() => this.input.$.isChecked());
  }

  public async editable() {
    this.message.push('editable');
    return this.execute(() => this.input.$.isEditable());
  }

  public async enabled() {
    this.message.push('enabled');
    return this.execute(() => this.input.$.isEnabled());
  }

  public async disabled() {
    this.message.push('disabled');
    return this.execute(() => this.input.$.isDisabled());
  }

  public async exist() {
    this.message.push('exist');
    return this.execute(async () => {
      return (await this.input.$.count()) > 0;
    });
  }
}
