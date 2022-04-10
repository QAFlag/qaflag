export const LogMessageTypeEnum = [
  'action',
  'pass',
  'fail',
  'info',
  'optionalFail',
] as const;
export type LogMessageType = typeof LogMessageTypeEnum[number];

export interface LogContent {
  name?: string;
  text: string;
}

export class LogMessage {
  public readonly timestamp: Date;

  public get name() {
    return this.content.name;
  }

  public get text() {
    return this.content.text;
  }

  constructor(
    public readonly type: LogMessageType,
    public readonly content: LogContent,
  ) {
    this.timestamp = new Date();
  }
}
