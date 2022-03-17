type HTMLTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'li' | 'div' | 'hr' | 'br';
type FontStyle = 'normal' | 'bold' | 'italic' | 'bold italic';

type Importance = 1 | 2 | 3 | 4 | 5;

type MessageDisplay = {
  style: FontStyle;
  level: Importance;
  prefix: string;
};

export const MessageTypeEnum = [
  'suiteHeader',
  'step',
  'scenarioHeader',
  'pass',
  'fail',
  'info',
] as const;
export type MessageType = typeof MessageTypeEnum[number];

const MessageTypeMap: { [name in MessageType]: MessageDisplay } = {
  suiteHeader: {
    style: 'bold',
    level: 5,
    prefix: '',
  },
  scenarioHeader: {
    style: 'bold',
    level: 5,
    prefix: '',
  },
  step: { style: 'bold', level: 3, prefix: '' },
  pass: {
    style: 'normal',
    level: 4,
    prefix: '✓  ',
  },
  fail: { style: 'normal', level: 5, prefix: '×  ' },
  info: { style: 'normal', level: 1, prefix: '' },
};

export interface MessageInterface {
  text: string;
  type: MessageType;
}
