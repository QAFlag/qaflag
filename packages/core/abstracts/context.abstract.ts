import { DebugContent } from '../types/log-provider.interface';
import { ContextInterface } from '../types/context.interface';
import { ScenarioInterface } from '../types/scenario.interface';

export abstract class Context implements ContextInterface {
  constructor(public readonly scenario: ScenarioInterface) {}

  public get logger() {
    return this.scenario.logger;
  }

  public debug(messages: DebugContent | DebugContent[]) {
    this.scenario.logger.debug(messages);
  }
}
