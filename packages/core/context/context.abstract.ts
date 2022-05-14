import { DebugContent } from '../types/log-provider.interface';
import { ContextInterface } from './context.interface';
import { ScenarioInterface } from '../scenario/scenario.interface';
import { LogContent } from '../models/log-message';

export abstract class Context implements ContextInterface {
  constructor(public readonly scenario: ScenarioInterface) {}

  public get logger() {
    return this.scenario.logger;
  }

  public debug(messages: DebugContent | DebugContent[]) {
    this.logger.debug(messages);
  }

  public fail(content: string | LogContent | LogContent[]) {
    this.logger.fail(content);
  }

  public pass(content: string | LogContent | LogContent[]) {
    this.logger.pass(content);
  }
}
