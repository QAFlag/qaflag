import chalk = require('chalk');
import { ConsoleOutput } from '../models/console-output';
import { printLineBreak } from './print';

export const exitSuccess = (message?: string) => {
  printLineBreak();
  new ConsoleOutput(message, {
    style: chalk.bgWhite.green,
  });
  printLineBreak();
  process.exit(0);
};

export const exitError = (message?: string) => {
  if (message) {
    printLineBreak();
    new ConsoleOutput(message, {
      style: chalk.bgWhite.red,
    });
    printLineBreak();
  }
  process.exit(1);
};
