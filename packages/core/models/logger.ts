import { Message, MessageType } from './message';

export class Logger {
  #messages: Message[] = [];
  #started: number | null = null;
  #ended: number | null = null;

  public get started() {
    return this.#started;
  }

  public get ended() {
    return this.#ended;
  }

  public get duration(): number {
    if (!this.started) throw 'Not yet started.';
    if (!this.ended) throw 'Not yet ended.';
    return this.ended - this.started;
  }

  public get length(): number {
    return this.#messages.length;
  }

  public start() {
    if (this.started) throw 'Already started.';
    if (this.ended) throw 'Already ended.';
    this.#started = Date.now();
  }

  public end() {
    if (!this.started) throw 'Not yet started.';
    if (this.ended) throw 'Already ended.';
    this.#ended = Date.now();
  }

  public log(type: MessageType, text: string) {
    if (!this.started) throw 'Not yet started.';
    if (this.ended) throw 'Already ended.';
    const message = new Message(type, text);
    this.#messages.push(message);
    return message;
  }

  public get messages(): Message[] {
    return this.#messages;
  }

  public count(type: MessageType | MessageType[]): number {
    return this.filter(type).length;
  }

  public filter(type: MessageType | MessageType[]): Message[] {
    type = Array.isArray(type) ? type : [type];
    return this.#messages.filter(message => type.includes(message.type));
  }

  public get failed(): boolean {
    return this.#messages.some(message => message.type == 'fail');
  }
}
