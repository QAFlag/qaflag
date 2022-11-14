import { Logger } from '../models/logger';
import { LogContent } from '../models/log-message';
import { ScenarioInterface } from '../scenario/scenario.interface';
import { DebugContent, LogProvider } from '../types/log-provider.interface';
import { PersonaInterface } from '../persona/persona.interface';

export interface ContextInterface extends LogProvider {
  scenario: ScenarioInterface;
  logger: Logger;
  persona: PersonaInterface;
  debug(messages: DebugContent | DebugContent[]): void;
  fail(content: string | LogContent | LogContent[]): void;
  pass(content: string | LogContent | LogContent[]): void;
  heading(messages: string | string[]): void;
  info(messages: string | string[]): void;
  debug(messages: DebugContent | DebugContent[]): void;
  group<T>(
    heading: string,
    tests: (context?: ContextInterface) => Promise<T>,
  ): any;
  set<T>(key: string, value: T): T;
  get<T = any>(key: string): T;
  push<T = any>(key: string, value: T): T[];
}
