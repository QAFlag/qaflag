import { MessageInterface, MessageType } from '../types/message.interface';

export class Logger {
  #messages: MessageInterface[] = [];

  public add(messages: MessageInterface) {
    if (!Array.isArray(messages)) {
      this.#messages.push(messages);
      return;
    }
    messages.forEach(message => {
      this.#messages.push(message);
    });
  }

  public log(type: MessageType, text: string) {
    this.add({ type, text });
  }

  public getMessages(): MessageInterface[] {
    return this.#messages;
  }

  public filter(type: MessageType | MessageType[]): MessageInterface[] {
    type = Array.isArray(type) ? type : [type];
    return this.#messages.filter(message => type.includes(message.type));
  }
}
