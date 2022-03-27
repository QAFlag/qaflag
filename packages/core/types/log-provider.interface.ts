import { Logger } from '../models/logger';
import { MessageType } from './message.interface';

export interface LogReceiver {
  log(type: MessageType, message: string): void;
}

export interface LogCollector {
  logger: Logger;
}
