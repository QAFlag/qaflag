import { ValueInterface } from '../value/value.interface';
import { mustOrShould } from './test';

export class TestBase<InputType = unknown> {
  protected message: string[];

  constructor(
    protected input: ValueInterface<InputType>,
    protected mustOrShould: mustOrShould,
    protected isNot: boolean = false,
    protected evalType: 'standard' | 'every' | 'some' = 'standard',
    message?: string[],
  ) {
    this.message = message || [input.name, mustOrShould];
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
}
