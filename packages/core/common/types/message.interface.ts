import chalk, { ChalkInstance } from 'chalk';

type HTMLTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'li' | 'div' | 'hr' | 'br';
type FontStyle = 'normal' | 'bold' | 'italic' | 'bold italic';

type Importance = 1 | 2 | 3 | 4 | 5;

type MessageDisplay = {
  style: FontStyle;
  level: Importance;
  prefix: string;
  console: ChalkInstance;
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
    console: chalk.bold.bgBlack.white,
    prefix: '',
  },
  scenarioHeader: {
    style: 'bold',
    level: 5,
    console: chalk.magenta.underline,
    prefix: '',
  },
  step: { style: 'bold', level: 3, console: chalk.yellow, prefix: '' },
  pass: {
    style: 'normal',
    level: 4,
    console: chalk.greenBright,
    prefix: '✓  ',
  },
  fail: { style: 'normal', level: 5, console: chalk.red, prefix: '×  ' },
  info: { style: 'normal', level: 1, console: chalk.bgGray, prefix: '' },
};

export interface MessageInterface {
  text: string;
  type: MessageType;
}
