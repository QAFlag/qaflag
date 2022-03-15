import { MessageInterface } from './message.interface';

export interface LogEmmitter {
  log(messages: MessageInterface | MessageInterface[]): void;
}

export interface LogCollector {
  getLog(): MessageInterface[];
}
