import { DebugContent, LoggerInterface } from '../types/log-provider.interface';
import { LogContent, LogMessage, LogMessageType } from './log-message';

export class Logger implements LoggerInterface {
  #messages: LogMessage[] = [];
  #started: number | null = null;
  #ended: number | null = null;

  public get started() {
    return this.#started;
  }

  public get ended() {
    return this.#ended;
  }

  public get duration(): number {
    this.enforceHasEnded();
    return (this.ended || 0) - (this.started || 0);
  }

  public get length(): number {
    return this.#messages.length;
  }

  public start() {
    this.enforceNotStarted();
    this.#started = Date.now();
  }

  public end() {
    this.enforceStartedButNotEnded();
    this.#ended = Date.now();
  }

  public get messages(): LogMessage[] {
    return this.#messages;
  }

  public count(type: LogMessageType | LogMessageType[]): number {
    return this.filter(type).length;
  }

  public filter(type: LogMessageType | LogMessageType[]): LogMessage[] {
    type = Array.isArray(type) ? type : [type];
    return this.#messages.filter(message => type.includes(message.type));
  }

  public get failed(): boolean {
    return this.#messages.some(message => message.type == 'fail');
  }

  protected enforceNotStarted() {
    if (this.started) throw 'Already started.';
    if (this.ended) throw 'Already ended.';
  }

  protected enforceStartedButNotEnded() {
    if (!this.started) throw 'Not yet started.';
    if (this.ended) throw 'Already ended.';
  }

  protected enforceHasEnded() {
    if (!this.started) throw 'Not yet started.';
    if (!this.ended) throw 'Not yet ended.';
  }

  protected messageToString(message: DebugContent) {
    if (
      typeof message == 'string' ||
      typeof message == 'number' ||
      typeof message == 'boolean'
    ) {
      return String(message);
    }
    return message.string.$;
  }

  public log(type: LogMessageType, content: LogContent | string) {
    this.enforceStartedButNotEnded();
    const message = new LogMessage(
      type,
      typeof content == 'string' ? { text: content } : content,
    );
    this.#messages.push(message);
    return message;
  }

  public debug(content: DebugContent | DebugContent[]) {
    const messages = Array.isArray(content) ? content : [content];
    messages.forEach(message => {
      this.log('info', { text: this.messageToString(message) });
    });
  }

  public action(content: LogContent | LogContent[]) {
    const messages = Array.isArray(content) ? content : [content];
    messages.forEach(action => this.log('action', action));
  }

  public pass(content: LogContent | string | LogContent[]) {
    const messages = Array.isArray(content) ? content : [content];
    messages.forEach(message => this.log('pass', message));
  }

  public fail(
    content: LogContent | string | LogContent[],
    isOptional: boolean = false,
  ) {
    const messages = Array.isArray(content) ? content : [content];
    messages.forEach(message => {
      this.log(isOptional ? 'fail' : 'optionalFail', message);
    });
  }
}
