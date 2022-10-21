export const LogMessageTypeEnum = [
  'action',
  'pass',
  'fail',
  'heading',
  'info',
  'optionalFail',
  'horizontalRule',
  'lineBreak',
] as const;
export type LogMessageType = typeof LogMessageTypeEnum[number];

export interface LogContent {
  name?: string;
  target?: string;
  text: string;
}

export class LogMessage {
  public readonly timestamp: Date;

  public get name() {
    return this.content.name;
  }

  public get text() {
    if (this.content.target) {
      return this.content.text
        ? `"${this.content.text}" on ${this.content.target}`
        : this.content.target;
    }
    return this.content.text;
  }

  constructor(
    public readonly type: LogMessageType,
    public readonly content: LogContent,
  ) {
    this.timestamp = new Date();
  }
}
