import { Message, MessageType } from '../models/message';

export interface LogProvider {
  log(type: MessageType, text: string): Message;
}
