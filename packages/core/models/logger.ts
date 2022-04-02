import { Message, MessageType } from './message';

export class Logger {
  #messages: Message[] = [];
  #started: Date | null = null;
  #ended: Date | null = null;

  public get started() {
    return this.#started;
  }

  public get ended() {
    return this.#ended;
  }

  public get length(): number {
    return this.#messages.length;
  }

  public start() {
    if (this.started) throw 'Already started.';
    if (this.ended) throw 'Already ended.';
    this.#started = new Date();
  }

  public end() {
    if (!this.started) throw 'Not yet started.';
    if (this.ended) throw 'Already ended.';
    this.#ended = new Date();
  }

  public log(type: MessageType, text: string) {
    if (!this.started) throw 'Not yet started.';
    if (this.ended) throw 'Already ended.';
    const message = new Message(type, text);
    this.#messages.push(message);
    return message;
  }

  public getMessages(): Message[] {
    return this.#messages;
  }

  public filter(type: MessageType | MessageType[]): Message[] {
    type = Array.isArray(type) ? type : [type];
    return this.#messages.filter(message => type.includes(message.type));
  }

  public get failed(): boolean {
    return this.#messages.some(message => message.type == 'fail');
  }
}
