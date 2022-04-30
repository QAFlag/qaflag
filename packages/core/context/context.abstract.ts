import { DebugContent } from '../types/log-provider.interface';
import { ContextInterface } from './context.interface';
import { ScenarioInterface } from '../scenario/scenario.interface';

export abstract class Context implements ContextInterface {
  constructor(public readonly scenario: ScenarioInterface) {}

  public get logger() {
    return this.scenario.logger;
  }

  public debug(messages: DebugContent | DebugContent[]) {
    this.scenario.logger.debug(messages);
  }
}
