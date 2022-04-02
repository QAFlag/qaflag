export const MessageTypeEnum = [
  'action',
  'pass',
  'fail',
  'info',
  'optionalFail',
] as const;
export type MessageType = typeof MessageTypeEnum[number];

export class Message {
  public readonly timestamp: Date;

  constructor(public readonly type: MessageType, public readonly text: string) {
    this.timestamp = new Date();
  }
}
