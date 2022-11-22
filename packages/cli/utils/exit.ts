import chalk = require('chalk');
import { ConsoleOutput } from '../models/console-output';
import { printLineBreak, printLines } from './print';

export const exitSuccess = (message?: string) => {
  printLineBreak();
  new ConsoleOutput(message || 'OK', {
    style: chalk.bgWhite.green,
  });
  printLineBreak();
  process.exit(0);
};

export const exitError = (message?: string) => {
  if (message) {
    printLines(['', message, '']);
  }
  process.exit(1);
};
