import { LogContent, LogMessage, LogMessageType } from '../models/log-message';
import { ValueInterface } from './value.interface';

export type DebugContent = string | number | boolean | ValueInterface;

export interface LogProvider {
  logger: LoggerInterface;
}

export interface LoggerInterface {
  log(type: LogMessageType, content: LogContent | string): LogMessage;
  debug(message: DebugContent | DebugContent[]): void;
  action(action: LogContent): void;
  pass(content: LogContent | string): void;
  fail(content: LogContent | string, isOptional?: boolean): void;
}
