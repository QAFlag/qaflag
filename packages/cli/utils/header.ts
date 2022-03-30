import * as chalk from 'chalk';
import { printLine } from './print';

export const printHeader = () => {
  printLine(['', 'QA FLAG', ''], {
    alignment: 'center',
    lineLength: 50,
    style: chalk.whiteBright.bold.bgHex('#0000aa'),
  });
};
