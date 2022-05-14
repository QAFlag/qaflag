import { LogContent } from '../models/log-message';
import { ScenarioInterface } from '../scenario/scenario.interface';
import { DebugContent, LogProvider } from '../types/log-provider.interface';

export interface ContextInterface extends LogProvider {
  scenario: ScenarioInterface;
  debug(messages: DebugContent | DebugContent[]): void;
  fail(content: string | LogContent | LogContent[]): void;
  pass(content: string | LogContent | LogContent[]): void;
}
